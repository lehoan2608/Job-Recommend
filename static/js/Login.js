// function Login(){
//     let Email = document.getElementById("Email").value;
//     let password = document.getElementById("password").value;
//     if(Email == ""){
//         alert("Bạn phải nhập Email!");
//     }else if(Email.indexOf("@") == -1 || Email.indexOf(".") == -1 || Email.indexOf(" ") != -1){
//         alert("Vui lòng nhập đúng Email!");
//     }else if(password == ""){
//         alert("Bạn phải nhập mật khẩu!");
//     }else{
//         alert("Đăng nhập thành công!");
//     }
// }

// function login() {
//     let email = document.getElementById("Email").value;
//     let password = document.getElementById("password").value;

//     if (!email) {
//         alert("Bạn phải nhập Email!");
//         return false;
//     }
//     if (!email.includes("@") || !email.includes(".") || email.includes(" ")) {
//         alert("Vui lòng nhập đúng Email!");
//         return false;
//     }
//     if (!password) {
//         alert("Bạn phải nhập mật khẩu!");
//         return false;
//     }

//     // Check against stored user data
//     let storedUser = localStorage.getItem("user_" + email);
//     if (!storedUser) {
//         alert("Email chưa được đăng ký!");
//         return false;
//     }

//     let user = JSON.parse(storedUser);
//     if (user.password !== password) {
//         alert("Mật khẩu không đúng!");
//         return false;
//     }

//     // Lưu current_user vào localStorage
//     localStorage.setItem("current_user", email);
//     alert("Đăng nhập thành công!");
//     // window.location.href = "index.html";
//     window.location.href = "/HomePage";
//     return false;
// }

function login() {
    let email = document.getElementById("Email").value;
    let password = document.getElementById("password").value;

    if (!email) {
        alert("Bạn phải nhập Email!");
        return false;
    }
    if (!email.includes("@") || !email.includes(".") || email.includes(" ")) {
        alert("Vui lòng nhập đúng Email!");
        return false;
    }
    if (!password) {
        alert("Bạn phải nhập mật khẩu!");
        return false;
    }

    // Check against stored user data (from localStorage)
    let storedUser = localStorage.getItem("user_" + email);
    if (!storedUser) {
        alert("Email chưa được đăng ký!");
        return false;
    }

    let user = JSON.parse(storedUser);
    if (user.password !== password) {
        alert("Mật khẩu không đúng!");
        return false;
    }

    // Lưu current_user vào localStorage (để dùng phía frontend nếu cần)
    localStorage.setItem("current_user", email);

    // Gửi email về server để lưu vào cookie
    fetch("/set_user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => {
        if (response.ok) {
            alert("Đăng nhập thành công!");
            window.location.href = "/HomePage";
        } else {
            alert("Đăng nhập thất bại trên server.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Có lỗi xảy ra khi gửi dữ liệu đăng nhập về server.");
    });

    return false;
}
