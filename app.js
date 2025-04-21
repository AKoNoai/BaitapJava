let users = [];
let currentUserId = null;
let nextId = 11; // Bắt đầu từ ID 11 vì API mẫu có 10 user

async function fetchUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) throw new Error("Không thể lấy được dữ liệu");
        users = await response.json();
        displayUsers(users);
    } catch (error) {
        console.error("Lỗi: ", error);
        document.getElementById('user-list').innerHTML = "<p>Lỗi khi tải dữ liệu người dùng</p>";
    }
}

function displayUsers(users) {
    const userList = document.getElementById('user-list');
    userList.innerHTML = "";

    users.forEach((user) => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-card';
        userDiv.innerHTML = `
            <div class="user-info">
                <img src="https://randomuser.me/api/portraits/men/${user.id}.jpg" alt="Avatar" class="avatar"/>
                <div class="user-details">
                    <h2>${user.name}</h2>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Phone:</strong> ${user.phone}</p>
                    <p><strong>Address:</strong> ${user.address.street}, ${user.address.city}</p>
                    <div class="user-actions">
                        <a class="btn-edit" onclick="openEditModal(${user.id})">Edit</a>
                        <a class="btn-delete" onclick="deleteUser(${user.id})">Delete</a>
                    </div>
                </div>
            </div>
        `;
        userList.appendChild(userDiv);
    });
}

function openAddModal() {
    document.getElementById('add-form').reset();
    document.getElementById('add-modal').style.display = 'flex';
}

function closeAddModal() {
    document.getElementById('add-modal').style.display = 'none';
}

document.getElementById("add-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Tạo user mới với ID tăng dần
    const newUser = {
        id: nextId++,
        name: document.getElementById('add-name').value,
        email: document.getElementById('add-email').value,
        phone: document.getElementById('add-phone').value,
        address: {
            street: document.getElementById('add-address').value.split(",")[0] || "",
            city: document.getElementById('add-address').value.split(",")[1] || "Unknown",
            suite: "",
            zipcode: "",
            geo: { lat: "", lng: "" }
        },
        company: {
            name: "",
            catchPhrase: "",
            bs: ""
        },
        username: document.getElementById('add-name').value.toLowerCase().replace(/\s/g, ''),
        website: ""
    };

    try {
        // Thêm vào mảng users trước (vì API fake không thực sự lưu)
        users.unshift(newUser); // Thêm vào đầu mảng
        displayUsers(users);
        closeAddModal();
        
        // Gọi API (chỉ để demo, không thực sự lưu trên server)
        await fetch('https://jsonplaceholder.typicode.com/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser),
        });
        
    } catch (error) {
        console.error("Lỗi: ", error);
        alert("Thêm mới thất bại: " + error.message);
    }
});

document.getElementById("cancel-add").addEventListener("click", closeAddModal);
document.getElementById("add-user-btn").addEventListener("click", openAddModal);

async function deleteUser(userId) {
    if(!confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) return;

    try {
        // Xóa khỏi mảng users trước
        users = users.filter((user) => user.id !== userId);
        displayUsers(users);
        
        // Gọi API (chỉ để demo, không thực sự xóa trên server)
        await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
            method: 'DELETE',
        });
        
    } catch (error) {
        console.error("Lỗi: ", error);
        alert("Xóa thất bại: " + error.message);
    }
}

function openEditModal(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    currentUserId = userId;

    document.getElementById('edit-name').value = user.name;
    document.getElementById('edit-email').value = user.email;
    document.getElementById('edit-phone').value = user.phone;
    document.getElementById('edit-address').value = `${user.address.street},${user.address.city}`;

    document.getElementById('edit-modal').style.display = 'flex';
}

function closeEditModal() {
    document.getElementById('edit-modal').style.display = 'none';
}

document.getElementById("edit-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedUser = {
        name: document.getElementById('edit-name').value,
        email: document.getElementById('edit-email').value,
        phone: document.getElementById('edit-phone').value,
        address: {
            street: document.getElementById('edit-address').value.split(",")[0] || "",
            city: document.getElementById('edit-address').value.split(",")[1] || "Unknown",
        },
    };

    try {
        // Cập nhật trong mảng users trước
        const index = users.findIndex(u => u.id === currentUserId);
        if (index !== -1) {
            users[index] = { ...users[index], ...updatedUser };
            displayUsers(users);
        }
        
        closeEditModal();
        
        // Gọi API (chỉ để demo, không thực sự cập nhật trên server)
        await fetch(`https://jsonplaceholder.typicode.com/users/${currentUserId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUser),
        });
        
    } catch (error) {
        console.error("Lỗi cập nhật: ", error);
        alert("Cập nhật thất bại: " + error.message);
    }
});

document.getElementById("cancel-edit").addEventListener("click", closeEditModal);

// Khởi tạo
fetchUsers();