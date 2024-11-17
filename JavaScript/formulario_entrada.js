document.addEventListener('DOMContentLoaded', function () {
    const employeeForm = document.getElementById('employeeForm');
    const employeeTableBody = document.getElementById('employeeTable').querySelector('tbody');
    let employees = []; // Lista para almacenar la información de los empleados

    // Maneja el evento de envío del formulario
    employeeForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        const cedula = document.getElementById('cedula').value.trim();
        const apellidos = document.getElementById('apellidos').value.trim();
        const nombre = document.getElementById('nombre').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const estadoCivil = document.getElementById('estadoCivil').value.trim();
        const direccion = document.getElementById('direccion').value.trim();
        const fechaNacimiento = document.getElementById('fechaNacimiento').value.trim();
        const Cargo = document.getElementById('Cargo').value.trim();
        const fechaIngreso = document.getElementById('fechaIngreso').value.trim();
        const salario = document.getElementById('Salario').value.trim();
        const HorasExtra = document.getElementById('HorasExtra').value.trim();
        const Arl = document.getElementById('Arl').value.trim();
        const tipoContrato = document.getElementById('tipoContrato').value.trim();
        const Pruebadesempeño = document.getElementById('PruebaDesempeño').value.trim();

        if (nombre !== '' && apellidos !== '') {
            // Agregar el empleado a la base de datos
            const employeeData = {
                Cedula: cedula,
                Apellidos: apellidos,
                Nombre: nombre,
                Telefono: telefono,
                EstadoCivil: estadoCivil,
                Direccion: direccion,
                FechaNacimiento: fechaNacimiento,
                Cargo: Cargo,
                FechaIngreso: fechaIngreso,
                Salario: salario,
                HorasExtras: HorasExtra,
                Arl: Arl,
                TipoContrato: tipoContrato,
                PruebaDesempeño: Pruebadesempeño,
            };

            try {
                const response = await fetch('http://localhost:3000/data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(employeeData),
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Empleado agregado con éxito');
                } else {
                    alert('Error al agregar empleado: ' + result.error);
                }
            } catch (error) {
                console.error('Error de conexión:', error);
                alert('Error al conectar con el servidor');
            }
        }
    });
});


