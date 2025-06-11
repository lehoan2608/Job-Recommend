function validateForm() {
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var number = document.getElementById("number").value;
    var password = document.getElementById("password").value;
    var male = document.getElementById("male").checked;
    var female = document.getElementById("female").checked;
    var emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!username) {
        alert("Mời bạn điền tên đăng nhập");
        return false;
    }
    if (!email) {
        alert("Mời bạn điền địa chỉ email");
        return false;
    }
    if (!emailRegex.test(email)) {
        alert("Email phải theo cấu trúc xyz@gmail.com");
        return false;
    }
    if (!number) {
        alert("Mời bạn điền số điện thoại");
        return false;
    }
    if (isNaN(number)) {
        alert("Mời nhập số điện thoại đúng ký tự dạng số");
        return false;
    }
    if (number.length !== 10) {
        alert("Mời bạn nhập số điện thoại đầy đủ 10 ký tự");
        return false;
    }
    if (!password) {
        alert("Mời bạn điền mật khẩu");
        return false;
    }
        if (password.length < 8) {
        alert("Mật khẩu phải có ít nhất 8 ký tự");
        return false;
    }
    if (!male && !female) {
        alert("Mời bạn chọn giới tính");
        return false;
    }

    // Store user data in localStorage
    var user = {
        username: username,
        email: email,
        number: number,
        password: password,
        gender: male ? "male" : "female"
    };
    localStorage.setItem("user_" + email, JSON.stringify(user));

    alert("Đăng ký thành công! Chuyển hướng tới trang đăng nhập");
    // window.location.href = "Login.html";
    window.location.href = "/";
    return false;
}