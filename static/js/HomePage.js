// Hiển thị tên người dùng
// const currentUserEmail = localStorage.getItem("current_user");
// if (currentUserEmail) {
//     const userData = JSON.parse(localStorage.getItem("user_" + currentUserEmail));
//     if (userData) {
//         document.getElementById("username-display").textContent = userData.username;
//     }
// } else {
//     window.location.href = "/";
// }
const currentUserEmail = localStorage.getItem("current_user");
if (currentUserEmail) {
    const userData = JSON.parse(localStorage.getItem("user_" + currentUserEmail));
    if (userData) {
        document.getElementById("username-display").textContent = userData.username;

        // Ẩn mục "Khu vực quản trị" nếu không phải admin
        if (currentUserEmail !== "admin@gmail.com") {
            const adminLink = document.getElementById("admin-link");
            if (adminLink) {
                adminLink.style.display = "none";
            }
        }
    }
} else {
    window.location.href = "/";
}

// Hàm đăng xuất
function logout() {
    localStorage.removeItem("current_user");
    alert("Đã đăng xuất!");
    window.location.href = "/";
}

// Xử lý form gợi ý việc làm
document.getElementById('candidateForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const sn = document.getElementById('sn').value.trim();
    const search_city = document.getElementById('search_city').value.trim();
    const search_country = document.getElementById('search_country').value.trim();
    const job_level = document.getElementById('job_level').value.trim();
    const job_type = document.getElementById('job_type').value.trim();
    const job_skills = document.getElementById('job_skills').value.trim();

    if (!sn || !search_city || !search_country || !job_level || !job_type || !job_skills) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    const formData = {
        sn: sn,
        search_city: search_city,
        search_country: search_country,
        job_level: job_level,
        job_type: job_type,
        job_skills: job_skills
    };

    try {
        const response = await fetch('/find_jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const results = await response.json();
        const tbody = document.querySelector('#resultsTable tbody');
        tbody.innerHTML = '';

        if (results.length === 0) {
            alert("Không tìm thấy công việc phù hợp với yêu cầu.");
            return;
        }

        results.forEach(job => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${job.job_suitability_rank}</td>
                <td>${job.query_sn}</td>
                <td>${job.company}</td>
                <td><a href="${job.job_link}" target="_blank">${job.job_link}</a></td>
                <td>${job.job_location}</td>
                <td>${job.similarity_score.toFixed(4)}</td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching job matches: ' + error.message);
    }
});
