let users = [];
let currentEditId = null;

async function fetchUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) throw new Error('Không thấy dữ liệu');
        users = await response.json();
        displayUsers(users);
    } catch (error) {
        console.error('Lỗi: ', error);
        document.getElementById('user-list').innerHTML = '<p>Lỗi khi tải dữ liệu người dùng.</p>';
    }
}

function displayUsers(users) {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';

    users.forEach((user, index) => {
        const card = document.createElement('div');
        card.classList.add('user-card');

        card.innerHTML = `
            <img src="https://randomuser.me/api/portraits/men/${index + 1}.jpg" alt="${user.name}" />
            <div>
                <h2>${user.name}</h2>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone:</strong> ${user.phone}</p>
                <p><strong>Address:</strong> ${user.address.street}, ${user.address.city}</p>
                <div>
                    <button onclick="openEditModal(${user.id})">Sửa</button>
                    <button onclick="deleteUser(${user.id})">Xoá</button>
                </div>
            </div>
        `;
        userList.appendChild(card);
    });
}

window.openEditModal = function (userId) {
    currentEditId = userId;
    const user = users.find(user => user.id === userId);
    if (!user) return;

    document.getElementById('edit-name').value = user.name;
    document.getElementById('edit-email').value = user.email;
    document.getElementById('edit-phone').value = user.phone;
    document.getElementById('edit-address').value = `${user.address.street}, ${user.address.city}`;
    document.getElementById('edit-modal').classList.remove('hidden');
};

function closeEditModal() {
    document.getElementById('edit-modal').classList.add('hidden');
    currentEditId = null;
}

document.getElementById('edit-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const updatedUser = {
        name: document.getElementById('edit-name').value,
        email: document.getElementById('edit-email').value,
        phone: document.getElementById('edit-phone').value,
        address: {
            street: document.getElementById('edit-address').value.split(',')[0].trim(),
            city: document.getElementById('edit-address').value.split(',')[1] || 'Unknown',
        },
    };

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${currentEditId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser),
        });

        if (!response.ok) throw new Error('Không thể cập nhật người dùng');

        users = users.map(user => user.id === currentEditId ? { ...user, ...updatedUser } : user);
        displayUsers(users);
        closeEditModal();
    } catch (error) {
        console.error('Lỗi: ', error);
        alert('Không thể cập nhật người dùng. ' + error.message);
    }
});

document.getElementById('cancel-edit').addEventListener('click', closeEditModal);

function toggleAddSection() {
    const addSection = document.getElementById('add-user-section');
    addSection.classList.toggle('hidden');
}

document.getElementById('add-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const newUser = {
        name: document.getElementById('add-name').value,
        email: document.getElementById('add-email').value,
        phone: document.getElementById('add-phone').value,
        address: {
            street: document.getElementById('add-address').value.split(',')[0].trim(),
            city: document.getElementById('add-address').value.split(',')[1] || 'Unknown',
        },
    };

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        });

        if (!response.ok) throw new Error('Không thể thêm người dùng');

        const createdUser = await response.json();
        users.push({ ...newUser, id: createdUser.id || Date.now() });
        displayUsers(users);
        document.getElementById('add-form').reset();
        document.getElementById('add-user-section').classList.add('hidden');
    } catch (error) {
        console.error('Lỗi: ', error);
        alert('Không thể thêm người dùng. ' + error.message);
    }
});

document.getElementById('add-user-btn').addEventListener('click', toggleAddSection);

window.deleteUser = async function (userId) {
    if (!confirm('Bạn có chắc muốn xoá người dùng này?')) return;

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Xoá thất bại');

        users = users.filter(user => user.id !== userId);
        displayUsers(users);
    } catch (error) {
        console.error('Lỗi: ', error);
        alert('Xoá thất bại: ' + error.message);
    }
};

fetchUsers();