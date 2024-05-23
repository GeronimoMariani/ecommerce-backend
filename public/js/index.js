function modifyRol(id) {
    axios.post(`http://localhost:8080/api/users/roles/${id}`)
        .then(response => {
            if (response.status === 200) {
                alert('Rol actualizado');
                location.reload();
            } else {
                alert('Error al actualizar el rol');
            }
        })
        .catch(err => console.error('Error:', err));
} 

function deleteUser(id) {
    axios.delete(`http://localhost:8080/api/users/${id}`)
        .then(response => {
            console.log('pase por aqui')
            if (response.status === 200) {
                alert('Usuario eliminado');
                location.reload();
            } else {
                alert('Error al eliminar el usuario');
            }
        })
        .catch(err => console.error('Error:', err));
}

