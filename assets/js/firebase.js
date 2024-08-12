class FirebaseUser {
    constructor() {
        this.URL = "https://conexion-agraria-default-rtdb.firebaseio.com/Api/Contac";
    }

    async setCreateUser(data) {
        try {
            const response = await fetch(this.URL + ".json", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Error al enviar los datos.');
            }

            console.log("Datos enviados correctamente.");
            return response.json();
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    }
}
