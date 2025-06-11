const currentUserEmail = localStorage.getItem("current_user");

if (!currentUserEmail) {
    alert("Bạn chưa đăng nhập!");
    window.location.href = "/";
}

const storedUser = JSON.parse(localStorage.getItem("user_" + currentUserEmail));
if (storedUser) {
    document.getElementById("edit-username").value = storedUser.username || "";
    document.getElementById("edit-email").value = currentUserEmail;
    document.getElementById("edit-number").value = storedUser.number || "";
    document.getElementById("edit-gender").value = storedUser.gender || "male";
}

function saveProfile() {
    const updatedUser = {
        username: document.getElementById("edit-username").value.trim(),
        number: document.getElementById("edit-number").value.trim(),
        gender: document.getElementById("edit-gender").value,
        password: storedUser.password, // giữ nguyên mật khẩu cũ
    };

    if (!updatedUser.username || !updatedUser.number) {
        alert("Vui lòng không để trống thông tin!");
        return;
    }

    localStorage.setItem("user_" + currentUserEmail, JSON.stringify(updatedUser));
    alert("Cập nhật thông tin thành công!");
}
