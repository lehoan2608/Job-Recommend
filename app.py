from flask import Flask, request, jsonify, render_template, redirect, make_response
import pandas as pd
import numpy as np
import re
import string
import os
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS

# ========== Init ==========
app = Flask(__name__)
CORS(app)

# ========== Download NLTK Data ==========
nltk.download('stopwords')
nltk.download('wordnet')
stopwords_nltk = set(stopwords.words("english"))
lemmatizer = WordNetLemmatizer()

# ========== Data Cleaning ==========
def clean_tokenize_skills(skills):
    if not skills or pd.isna(skills):
        return []
    skills = re.sub(r'[^a-zA-Z,\s]', '', skills).lower()
    return [lemmatizer.lemmatize(skill.strip()) for skill in skills.split(',') if skill.strip() not in stopwords_nltk]

def skills_to_string(skills_list):
    return ' '.join(skills_list)

# ========== Merge and Load Job Data ==========
def merge_job_files():
    job_skills_path = 'C:/HocTap/DoAnTotNghiep/archive/job_skills.csv'
    job_postings_path = 'C:/HocTap/DoAnTotNghiep/archive/linkedin_job_postings.csv'
    output_path = 'job_posts_skills.csv'

    if not os.path.exists(output_path):
        df_job_skills = pd.read_csv(job_skills_path)
        df_job_postings = pd.read_csv(job_postings_path)
        df_combined = df_job_postings.merge(df_job_skills, on="job_link", how="inner")
        df_combined = df_combined.drop(columns=[col for col in ['got_summary', 'got_ner', 'is_being_worked'] if col in df_combined.columns])
        df_combined.to_csv(output_path, index=False)
        print(f"File {output_path} created.")
    else:
        print("Merged file already exists.")

merge_job_files()
job_posts_df = pd.read_csv('C:/HocTap/DoAnTotNghiep/DoAnTotNghiep/job_posts_skills.csv')
job_posts_df.dropna(subset=['job_skills'], inplace=True)
job_posts_df = job_posts_df[job_posts_df['job_skills'] != ""]
job_posts_df['cleaned_job_skills'] = job_posts_df['job_skills'].apply(clean_tokenize_skills)
job_posts_df['skills_str'] = job_posts_df['cleaned_job_skills'].apply(skills_to_string)

# ========== TF-IDF Vectorization ==========
tfidf_vectorizer = TfidfVectorizer()
job_skills_tfidf = tfidf_vectorizer.fit_transform(job_posts_df['skills_str'])

# ========== Routes ==========
@app.route('/')
def login():
    return render_template('Login.html')

@app.route('/register')
def register():
    return render_template('RegisterForm.html')

@app.route('/HomePage')
def homepage():
    return render_template('HomePage.html')

@app.route('/view-users')
def view_users():
    user_email = request.cookies.get('current_user')
    if user_email != "admin@gmail.com":
        return redirect('/')
    return render_template('ViewUsers.html')

@app.route('/set_user', methods=['POST'])
def set_user():
    data = request.json
    email = data.get("email")
    if not email:
        return jsonify({"error": "No email provided"}), 400
    resp = make_response(jsonify({"message": "User set"}))
    resp.set_cookie('current_user', email)
    return resp

@app.route('/profile')
def profile():
    return render_template('Profile.html')

@app.route('/find_jobs', methods=['POST'])
def find_jobs():
    data = request.json
    user_input = {
        "sn": data.get("sn"),
        "search_city": data.get("search_city"),
        "search_country": data.get("search_country"),
        "job_level": data.get("job_level"),
        "job_type": data.get("job_type"),
        "job_skills": data.get("job_skills")
    }

    user_df = pd.DataFrame([user_input])
    user_df['cleaned_job_skills'] = user_df['job_skills'].apply(clean_tokenize_skills)
    user_df['skills_str'] = user_df['cleaned_job_skills'].apply(skills_to_string)
    user_skills_tfidf = tfidf_vectorizer.transform(user_df['skills_str'])
    similarity_scores = cosine_similarity(user_skills_tfidf, job_skills_tfidf).flatten()
    job_posts_df['similarity_score'] = similarity_scores

    filtered_jobs = job_posts_df[
        (job_posts_df['search_city'] == user_input['search_city']) &
        (job_posts_df['search_country'] == user_input['search_country']) &
        (job_posts_df['job_level'] == user_input['job_level']) &
        (job_posts_df['job_type'] == user_input['job_type'])
    ].copy()

    filtered_jobs = filtered_jobs.sort_values(by='similarity_score', ascending=False).head(5)
    filtered_jobs['job_suitability_rank'] = range(1, len(filtered_jobs) + 1)
    filtered_jobs['query_sn'] = user_input['sn']

    result = filtered_jobs[['job_suitability_rank', 'query_sn', 'company', 'job_link', 'job_location', 'similarity_score']]
    return jsonify(result.to_dict(orient='records'))

# ========== Run ==========
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
