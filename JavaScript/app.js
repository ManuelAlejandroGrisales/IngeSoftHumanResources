/*
Manuel Alejandro Grisales Pescador
John Esteban Perdomo
Andy Santiago Cano Arteaga
*/

document.addEventListener('DOMContentLoaded', function () {
    const employeeForm = document.getElementById('employeeForm');
    const employeeInput = document.getElementById('employeeInput');
    const employeeTableBody = document.getElementById('employeeTable').querySelector('tbody');
    let employees = []; // Lista para almacenar la información de los empleados

    console.log("Client-side script loaded");

    // Función para obtener datos de empleados desde el servidor
    async function fetchEmployeeData() {
        try {
            const response = await fetch('/data');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            // Cargar los datos iniciales desde el servidor
            data.forEach(employee => {
                addEmployeeToList(
                    employee._id,
                    employee.Cedula,
                    employee.Apellidos,
                    employee.Nombre,
                    employee.Telefono,
                    employee.EstadoCivil,
                    employee.Direccion,
                    employee.FechaNacimiento,
                    employee.Cargo,
                    employee.FechaIngreso,
                    employee.Salario,
                    employee.HorasExtras,
                    employee.Arl,
                    employee.TipoContrato,
                    employee.PruebaDesempeño,
                    employee.FechaRetiro
                );
            });

            renderEmployeeTable();
            console.log(employees);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    fetchEmployeeData();

    // Maneja el evento de envío del formulario
    employeeForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const employeeName = employeeInput.value.trim();
        if (employeeName !== '') {
            addEmployeeToPage(employeeName);
            employeeInput.value = '';
            renderEmployeeTable();
        }
    });

    // Agrega un empleado a la lista
    function addEmployeeToList(employeeId, cedula, apellidos, nombre, telefono, estadocivil, direccion, fechanacimiento, cargo, fechaingreso, salario, horasextras, arl, tipocontrato, pruebadesempeño, fecharetiro) {
        employees.push({
            id: employeeId,
            cedula,
            apellidos,
            nombre,
            telefono, 
            estadocivil, 
            direccion, 
            fechanacimiento, 
            cargo, 
            fechaingreso, 
            salario, 
            horasextras, 
            arl, 
            tipocontrato, 
            pruebadesempeño, 
            fecharetiro
        });
    }

    // Agrega un empleado a la base de datos y la página
    function addEmployeeToPage(nombreEmpleado) {
        saveEmployeeToDatabase(nombreEmpleado);
    }

    async function saveEmployeeToDatabase(nombreEmpleado) {
        try {
            const response = await fetch('/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Nombre: nombreEmpleado,
                    Apellidos: '', // Campo opcional
                    Cedula: '', // Campo opcional
                }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Added:', result);

            // Agrega el nuevo empleado a la lista
            addEmployeeToList(result.documentId, '', '', nombreEmpleado);
            renderEmployeeTable();
        } catch (error) {
            console.error('Error adding employee:', error);
        }
    }

     async function removeEmployeeFromDatabase(employeeId) {
         try {
             // Show confirmation dialog
             if (!confirm('¿Está seguro que desea eliminar este empleado?')) {
                return;
            }
    
            const response = await fetch(`/data/${employeeId}`, {
                 method: 'DELETE',
                 headers: {
                     'Content-Type': 'application/json'
                 }
             });
    
             if (!response.ok) {
                 throw new Error(`Error: ${response.statusText}`);
             }
    
             const result = await response.json();
            
             if (result.message) {
                 // Remove employee from local array
                 employees = employees.filter(emp => emp.id !== employeeId);
                
                 // Update the table display
                 renderEmployeeTable();
                
                 // Show success message
                 alert('Empleado eliminado exitosamente');
             }
         } catch (error) {
             console.error('Error al eliminar empleado:', error);
             alert('Error al eliminar el empleado');
         }
     }
    
    

    // Función para eliminar un empleado
    function deleteEmployee(employeeId) {
        removeEmployeeFromDatabase(employeeId);
    }


    function editEmployee(employeeId) {
        const currentEmployee = employees.find(emp => emp.id === employeeId);
        //console.log(currentEmployee);
        //console.log(employeeId)

        const editDialog = document.createElement('div');
        editDialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border: 1px solid #ccc;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
        `;

        editDialog.innerHTML = `
            <h3>Editar Empleado</h3>
            <div>
                <label for="newName">Cedula:</label>
                <input type="text" id="newCedula" value="${currentEmployee.cedula || ''}" />
            </div>
            <div style="margin-top: 10px;">
                <label for="newName">Nombre:</label>
                <input type="text" id="newName" value="${currentEmployee.nombre || ''}" />
            </div>
            
            <div style="margin-top: 10px;">
                <label for="newLastName">Apellidos:</label>
                <input type="text" id="newLastName" value="${currentEmployee.apellidos || ''}" />
            </div>
            <div style="margin-top: 10px;">
                <label for="newLastName">Telefono:</label>
                <input type="text" id="newTelefono" value="${currentEmployee.telefono || ''}" />
            </div>
            <div style="margin-top: 10px;">
                <label for="newLastName">Estado Civil:</label>
                <select id="newEstadoCivil" required>
                    <option value="Solter@">Solter@</option>
                    <option value="Casad@">Casad@</option>
                    <option value="Divorciad@">Divorciad@</option>
                    <option value="Viud@">Viud@</option>
                </select>
            </div>
            <div style="margin-top: 10px;">
                <label for="newLastName">Direccion:</label>
                <input type="text" id="newDireccion" value="${currentEmployee.direccion || ''}" />
            </div>
            <div style="margin-top: 10px;">
                <label for="newLastName">Fecha de Nacimiento:</label>
                <input type="date" id="newfechaNacimiento" value="${currentEmployee.fechanacimiento || ''}">
            </div>
            <div style="margin-top: 10px;">
                <label for="newLastName">Cargo:</label>
                <input type="text" id="newCargo" value="${currentEmployee.cargo || ''}" />
            </div>
            <div style="margin-top: 10px;">
                <label for="newLastName">Fecha de Ingreso:</label>
                <input type="date" id="newfechaIngreso" value="${currentEmployee.fechaingreso || ''}">
            </div>
            <div style="margin-top: 10px;">
                <label for="newLastName">Salario:</label>
                <input type="text" id="newSalario" value="${currentEmployee.salario || ''}" />
            </div>
            <div style="margin-top: 10px;">
                <label for="newLastName">Horas Extras:</label>
                <input type="text" id="newHorasExtra" value="${currentEmployee.horasextras || ''}" />
            </div>
            <div style="margin-top: 10px;">
                <label for="newLastName">Arl:</label>
                <input type="text" id="newArl" value="${currentEmployee.arl || ''}" />
            </div>
            <div style="margin-top: 10px;">
                <label for="newLastName">Tipo de Contrato:</label>
                <select id="newTipoContrato" required>
                    <option value="Indefinido">Indefinido</option>
                    <option value="Temporal">Temporal</option>
                </select>   
            </div>
            <div style="margin-top: 10px;">
                <label for="newPrueba">Prueba Desempeño:</label>
                <select id="newPrueba" required>
                    <option value="Aprobada">Aprobada</option>
                    <option value="No Aprobada">No Aprobada</option>
                    <option value="Pendiente">Pendiente</option>
                </select>  
            </div>
            <div style="margin-top: 10px;">
                <label for="newLastName">Fecha Retiro:</label>
                <input type="date" id="newfechaRetiro" value="${currentEmployee.fecharetiro || ''}">
            </div>
            <div style="margin-top: 15px;">
                <button id="saveBtn">Guardar</button>
                <button id="cancelBtn">Cancelar</button>
            </div>
        `;
 
        

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 999;
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(editDialog);

        
        //************************** */

        //LLenar las variables que son dropdown con el valor ya en la base de datos
        let VariableOptions = [currentEmployee.estadocivil, "newEstadoCivil", currentEmployee.tipocontrato, "newTipoContrato", currentEmployee.pruebadesempeño, "newPrueba"];

        
        for (let index = 0; index < VariableOptions.length; index+=2) {
            selectElement(VariableOptions[index], VariableOptions[index+1]);
        }

        function selectElement(valueToSelect, id) {  
            //console.log(id);  
            //console.log(valueToSelect);
            let element = document.getElementById(id);
            //console.log(element);
            element.value = valueToSelect;
            //console.log("ready"); 
            //console.log("**************************************************************************"); 
        }

        /******************** */

        const saveBtn = editDialog.querySelector('#saveBtn');
        const cancelBtn = editDialog.querySelector('#cancelBtn');

        saveBtn.addEventListener('click', () => {
            const newName = editDialog.querySelector('#newName').value.trim();
            const newLastName = editDialog.querySelector('#newLastName').value.trim();
            const newcedula = editDialog.querySelector('#newCedula').value.trim();
            const newtelefono = editDialog.querySelector('#newTelefono').value.trim();
            const newEstadoCivil = editDialog.querySelector('#newEstadoCivil').value.trim();
            const newDireccion = editDialog.querySelector('#newDireccion').value.trim();
            const newfechaNacimiento = editDialog.querySelector('#newfechaNacimiento').value.trim();
            const newCargo = editDialog.querySelector('#newCargo').value.trim();
            const newfechaIngreso = editDialog.querySelector('#newfechaIngreso').value.trim();
            const newSalario = editDialog.querySelector('#newSalario').value.trim();
            const newHorasExtra = editDialog.querySelector('#newHorasExtra').value.trim();
            const newArl = editDialog.querySelector('#newArl').value.trim();
            const newTipoContrato = editDialog.querySelector('#newTipoContrato').value.trim();
            const newPrueba = editDialog.querySelector('#newPrueba').value.trim();
            const newfechaRetiro = editDialog.querySelector('#newfechaRetiro').value.trim();



            if (newName !== '' && newLastName !== '') {
                console.log("Modified Data:");
                console.log([employeeId, newName, newLastName, newcedula, newtelefono, newEstadoCivil, newDireccion, newfechaNacimiento, newCargo, newfechaIngreso, newSalario, newHorasExtra, newArl, newTipoContrato, newPrueba, newfechaRetiro]);
                updateEmployeeData(employeeId, newName, newLastName, newcedula, newtelefono, newEstadoCivil, newDireccion, newfechaNacimiento, newCargo, newfechaIngreso, newSalario, newHorasExtra, newArl, newTipoContrato, newPrueba, newfechaRetiro);
                closeDialog();
            } else {
                alert('Por favor complete todos los campos');
            }
        });

        cancelBtn.addEventListener('click', closeDialog);

        function closeDialog() {
            document.body.removeChild(overlay);
            document.body.removeChild(editDialog);
        }
    }

    async function updateEmployeeData(employeeId, newName, newLastName, newcedula, newtelefono, newEstadoCivil, newDireccion, newfechaNacimiento, newCargo, newfechaIngreso, newSalario, newHorasExtra, newArl, newTipoContrato, newPrueba, newfechaRetiro) {
        try {
            const response = await fetch(`/data/${employeeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Cedula: newcedula,
                    Apellidos: newLastName,
                    Nombre: newName,
                    Telefono: newtelefono, 
                    EstadoCivil: newEstadoCivil,
                    Direccion: newDireccion,
                    FechaNacimiento: newfechaNacimiento,
                    Cargo: newCargo,
                    FechaIngreso: newfechaIngreso,
                    Salario: newSalario,
                    HorasExtras: newHorasExtra,
                    Arl: newArl,
                    TipoContrato: newTipoContrato,
                    PruebaDesempeño: newPrueba,
                }),
            });

            const result = await response.json();
            /*if (result.message === 'Empleado actualizado con éxito') {
                employees = employees.map(emp =>
                    emp.id === employeeId
                        ? { ...emp, nombre: newName, apellidos: newLastName }
                        : emp
                );
                renderEmployeeTable();
            }*/
        } catch (error) {
            console.error('Error updating employee data:', error);
        }
    }

    function renderEmployeeTable() {
        employeeTableBody.innerHTML = '';
        employees.forEach(emp => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${emp.nombre || 'N/A'}</td>
                <td>${emp.apellidos || 'N/A'}</td>
                <td>
                    <button class="edit">Editar</button>
                    <button class="delete">Eliminar</button>
                </td>
            `;

            const editBtn = row.querySelector('.edit');
            const deleteBtn = row.querySelector('.delete');

            editBtn.addEventListener('click', () => editEmployee(emp.id));
            deleteBtn.addEventListener('click', () => deleteEmployee(emp.id));

            employeeTableBody.appendChild(row);
        });
    }
});
