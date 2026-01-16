
// FORM HANDLING FOR DASHBOARD BUTTONS
// Use already declared globals from main.js
// modal, modalForm, modalClose, dbData, refreshTables are already global

const addButtons = document.querySelectorAll('.btn-add');

// Open modal form for adding
addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const table = btn.dataset.table;
        openAddForm(table);
    });
});

function openAddForm(table) {
    modalTitle.textContent = `Add New ${capitalize(table)}`;
    modalForm.innerHTML = '';

    let fields = [];
    if (table === 'inventory') {
        fields = ['name', 'total', 'status'];
    } else if (table === 'members') {
        fields = ['name', 'phone', 'national_id', 'date_joined'];
    } else if (table === 'rentals') {
        fields = ['member_name', 'item', 'qty', 'date_out', 'payment'];
    }

    const inputs = {};

    fields.forEach(field => {
        const label = document.createElement('label');
        label.textContent = capitalize(field.replace('_', ' '));
        let input;

        if (table === 'rentals' && field === 'member_name') {
            input = document.createElement('select');
            dbData.members.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m.name;
                opt.textContent = m.name;
                input.appendChild(opt);
            });
        } else if (table === 'rentals' && field === 'item') {
            input = document.createElement('select');
            updateAvailableItems(input);
            input.addEventListener('change', () => {
                const selected = dbData.inventory.find(i => i.name === input.value);
                if (inputs['qty']) {
                    inputs['qty'].max = selected ? selected.available : 0;
                }
            });
        } else {
            input = document.createElement('input');
            if (field === 'date_out' || field === 'date_joined') input.type = 'date';
            else if (field === 'qty' || field === 'total' || field === 'payment') input.type = 'number';
            else input.type = 'text';
        }

        input.id = field;
        input.required = true;
        inputs[field] = input;

        modalForm.appendChild(label);
        modalForm.appendChild(input);
    });

    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Add';
    submitBtn.type = 'button';
    submitBtn.onclick = () => handleFormSubmit(table, fields);
    modalForm.appendChild(submitBtn);

    modal.classList.remove('hidden');
}

// Helper to update inventory dropdown dynamically
function updateAvailableItems(selectElement) {
    selectElement.innerHTML = '';
    dbData.inventory.forEach(i => {
        if (i.available > 0) {
            const opt = document.createElement('option');
            opt.value = i.name;
            opt.textContent = `${i.name} (Available: ${i.available})`;
            selectElement.appendChild(opt);
        }
    });
}

// Single, unified handleFormSubmit
function handleFormSubmit(table, fields) {
    const newRow = {};
    for (const f of fields) {
        const el = document.getElementById(f);
        if (!el.value) return notify(`Please fill ${f}`);
        let val = el.value;
        if (el.type === 'number') val = Number(val);
        newRow[f] = val;
    }

    // Rentals special handling
    if (table === 'rentals') {
        const invItem = dbData.inventory.find(i => i.name === newRow.item);
        if (!invItem) return notify(`Item "${newRow.item}" does not exist`);
        if (newRow.qty > invItem.available) return notify(`Not enough "${newRow.item}" in inventory`);

        newRow.available = invItem.available - newRow.qty;
        invItem.available -= newRow.qty;
        invItem.rented += newRow.qty;
    }

    // Auto-increment ID
    const existingIds = dbData[table].map(r => r.id);
    newRow.id = existingIds.length ? Math.max(...existingIds) + 1 : 1;

    dbData[table].push(newRow);
    refreshTables();
    modal.classList.add('hidden');
}

// Utils
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
