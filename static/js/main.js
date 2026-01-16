// MAIN.JS

function notify(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.remove('hidden');
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 2500);
}

window.notify = notify;

// Local DB
let dbData = {
    inventory: [
        { id: 1, name: 'Chair', total: 2500, available: 1500, rented: 1000, status: 'Good' },
        { id: 2, name: 'Table', total: 30, available: 20, rented: 10, status: 'Good' },
        { id: 3, name: 'Tents', total: 50, available: 44, rented: 6, status: 'Good' },
        { id: 4, name: 'Speakers', total: 15, available: 12, rented: 3, status: 'Good' },
        { id: 5, name: 'Sufurias', total: 28, available: 18, rented: 10, status: 'Good' },
        { id: 6, name: 'Plates', total: 850, available: 500, rented: 350, status: 'Good' },
        { id: 7, name: 'Platform', total: 4, available: 4, rented: 0, status: 'Good' },
        { id: 8, name: 'OutdoorTv', total: 12, available: 10, rented: 2, status: 'Good' }
    ],
    members: [
        { id: 1, name: 'Phillip Paul', phone: '0712345678', national_id: '12345678', date_joined: '2025-01-01' },
        { id: 2, name: 'Victor Paul', phone: '0798765432', national_id: '87654321', date_joined: '2025-02-15' },
        { id: 3, name: 'Alice Mast', phone: '0723456789', national_id: '23456789', date_joined: '2025-03-05' },
        { id: 4, name: 'Bob Colline', phone: '0734567890', national_id: '34567890', date_joined: '2025-04-10' },
        { id: 5, name: 'Charlie Blee', phone: '0745678901', national_id: '45678901', date_joined: '2025-05-12' },
        { id: 6, name: 'Diana Prince', phone: '0756789012', national_id: '56789012', date_joined: '2025-06-08' },
        { id: 7, name: 'Ethan Hunt', phone: '0767890123', national_id: '67890123', date_joined: '2025-07-20' },
        { id: 8, name: 'Alice Morse', phone: '0778901234', national_id: '78901234', date_joined: '2025-08-25' }
    ],
    rentals: [
        { id: 1, member_name: 'Phillip Paul', phone: '0712345678', item: 'Chair', qty: 5, available: 40, date_out: '2026-01-16', payment: 500 },
        { id: 2, member_name: 'Victor Paul', phone: '0798765432', item: 'Table', qty: 2, available: 18, date_out: '2026-01-17', payment: 200 },
        { id: 3, member_name: 'Alice Mast', phone: '0723456789', item: 'Tents', qty: 1, available: 6, date_out: '2026-01-18', payment: 150 },
        { id: 4, member_name: 'Bob Colline', phone: '0734567890', item: 'Speakers', qty: 3, available: 9, date_out: '2026-01-19', payment: 300 },
        { id: 5, member_name: 'Charlie Blee', phone: '0745678901', item: 'Sufurias', qty: 1, available: 11, date_out: '2026-01-20', payment: 250 },
        { id: 6, member_name:'Diana Prince' , phone:'0756789012' , item:'Plates' , qty :2 , available :6 , date_out :'2026-01-21' , payment :180 },
        { id: 7, member_name: 'Ethan Hunt', phone: '0767890123', item: 'Platform', qty: 5, available: 13, date_out: '2026-01-22', payment: 100 },
        { id: 8, member_name: 'Alice Morse', phone: '0778901234', item: 'Chair', qty: 1, available: 4, date_out: '2026-01-23', payment: 220 }
    ]
};

// Expose DB globally so form.js can access
window.dbData = dbData;

// Tables & Views

const tables = ["inventory", "members", "rentals"];
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.nav-links li');
const views = document.querySelectorAll('.view');

menuToggle.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('show');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const target = link.dataset.view;
        views.forEach(v => v.classList.remove('active'));
        document.getElementById(target).classList.add('active');

        // COLLAPSE MENU ON NAVIGATE (mobile)
        document.querySelector('.nav-links').classList.remove('show');

        if (target !== 'repl') refreshTables();
    });
});

// Modal Handling
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');
const modalForm = document.getElementById('modal-form');
modalClose.addEventListener('click', () => modal.classList.add('hidden'));

// Table Rendering
function renderTable(tableName) {
    const tbody = document.querySelector(`#tbl-${tableName} tbody`);
    if (!tbody) return;
    tbody.innerHTML = "";

    const rows = dbData[tableName] || [];
    rows.forEach(row => {
        const tr = document.createElement('tr');
        if (tableName === "inventory") {
            tr.innerHTML = `
                <td>${row.name}</td>
                <td>${row.total}</td>
                <td>${row.available}</td>
                <td>${row.rented}</td>
                <td>${row.status}</td>
                <td><button class="btn-del" onclick="deleteRow('inventory', ${row.id})">Delete</button></td>
            `;
        } else if (tableName === "members") {
            tr.innerHTML = `
                <td>${row.name}</td>
                <td>${row.phone}</td>
                <td>${row.national_id}</td>
                <td>${row.date_joined}</td>
                <td><button class="btn-del" onclick="deleteRow('members', ${row.id})">Delete</button></td>
            `;
        } else if (tableName === "rentals") {
            tr.innerHTML = `
                <td>${row.member_name}</td>
                <td>${row.phone}</td>
                <td>${row.item}</td>
                <td>${row.qty}</td>
                <td>${row.available}</td>
                <td>${row.date_out}</td>
                <td>${row.payment}</td>
                <td><button class="btn-del" onclick="deleteRow('rentals', ${row.id})">Delete</button></td>
            `;
        }
        tbody.appendChild(tr);
    });
}

function refreshTables() {
    tables.forEach(t => renderTable(t));
}

// Expose to global
window.refreshTables = refreshTables;

// Delete Row
function deleteRow(table, id) {
    const confirmed = confirm("Are you sure you want to delete this row?");
    if (!confirmed) return;
    dbData[table] = dbData[table].filter(r => r.id !== id);
    refreshTables();
}
window.deleteRow = deleteRow;
 
// REPL Parser
// REPL COMMAND EXECUTOR
const replInput = document.getElementById('repl-input');
const replBtn = document.getElementById('repl-btn');
const replResultsSingle = document.getElementById('repl-results-single');
const replResultsJoin = document.getElementById('repl-results-join');

replBtn.addEventListener('click', () => execCommand(replInput.value));

async function execCommand(cmd) {
    cmd = cmd.trim();
    replResultsSingle.innerHTML = '';
    replResultsJoin.innerHTML = '';

    if (!cmd) return;

    replInput.disabled = true;
    replBtn.disabled = true;

    try {
        // SELECT
        if (/^SELECT/i.test(cmd)) {
            handleSelect(cmd);
            return;
        }

        // DELETE
        const deleteRegex = /^DELETE\s+FROM\s+(\w+)\s+WHERE\s+id\s*=\s*(\d+)$/i;
        const deleteMatch = cmd.match(deleteRegex);
        if (deleteMatch) {
            handleDelete(deleteMatch);
            return;
        }

        // INSERT
        const insertRegex = /^INSERT\s+INTO\s+(\w+)\s*\(([\w\s,]+)\)\s*VALUES\s*\(([\w\s'",.-]+)\)$/i;
        const insertMatch = cmd.match(insertRegex);
        if (insertMatch) {
            handleInsert(insertMatch);
            return;
        }

        // UPDATE
        const updateRegex = /^UPDATE\s+(\w+)\s+SET\s+(.+)\s+WHERE\s+id\s*=\s*(\d+)$/i;
        const updateMatch = cmd.match(updateRegex);

        if (updateMatch) {
            const tableName = updateMatch[1];
            const setPart = updateMatch[2];
            const id = parseInt(updateMatch[3]);

            if (!dbData[tableName]) {
                notify(`Table ${tableName} does not exist`);
                return;
            }

            const row = dbData[tableName].find(r => r.id === id);
            if (!row) {
                notify(`Row with id=${id} not found in ${tableName}`);
                return;
            }

            setPart.split(',').forEach(pair => {
                let [col, rawVal] = pair.split('=').map(x => x.trim());
                let val = rawVal.replace(/^["']|["']$/g, '');
                if (!col.includes('date') && !isNaN(val)) val = Number(val);
                row[col] = val;
            });

            notify(`Updated ${tableName} id=${id}`);
            refreshTables();
            return;
        }

        // Unknown commands
        notify(`Unknown or malformed command: "${cmd}"`);

    } catch (err) {
        console.error(err);
        notify('Error executing command. Check syntax.');
    } finally {
        replInput.disabled = false;
        replBtn.disabled = false;
        refreshTables();
    }
}

// SELECT handler
function handleSelect(cmd) {
    try {
        let [selectPart, fromPart] = cmd.split(/\s+FROM\s+/i);
        const rawCols = selectPart.replace(/^SELECT/i, '').trim();

        let whereClause = null;
        if (/WHERE/i.test(fromPart)) {
            const parts = fromPart.split(/\s+WHERE\s+/i);
            fromPart = parts[0].trim();
            whereClause = parts[1].trim();
        }

        const joinTokens = fromPart.split(/\s+JOIN\s+/i).map(s => s.trim());
        const baseTableName = joinTokens[0].split(/\s+/)[0];

        if (!dbData[baseTableName]) return notify(`Table ${baseTableName} does not exist`);

        let rows;

        if (joinTokens.length === 1) {
            // Single-table SELECT
            rows = dbData[baseTableName].map(r => ({ ...r }));
        } else {
            // Multi-table JOIN
            const baseAlias = baseTableName;
            rows = dbData[baseTableName].map(r => ({ [baseAlias]: r }));

            for (let i = 1; i < joinTokens.length; i++) {
                const m = joinTokens[i].match(/(\w+)(?:\s+(\w+))?\s+ON\s+(.+)/i);
                if (!m) return notify('Invalid JOIN syntax');
                const [_, joinTable, alias, condition] = m;
                const joinAlias = alias || joinTable;

                if (!dbData[joinTable]) return notify(`Table ${joinTable} does not exist`);

                rows = rows.flatMap(r => {
                    return dbData[joinTable]
                        .filter(joinRow => {
                            const [left, right] = condition.split('=').map(s => s.trim());
                            const [leftAlias, leftCol] = left.split('.');
                            const [rightAlias, rightCol] = right.split('.');
                            return r[leftAlias][leftCol] === joinRow[rightCol];
                        })
                        .map(joinRow => ({ ...r, [joinAlias]: joinRow }));
                });
            }

            // Flatten rows
            rows = rows.map(r => {
                const fr = {};
                for (let alias in r) {
                    for (let k in r[alias]) {
                        fr[`${alias}.${k}`] = r[alias][k];
                    }
                }
                return fr;
            });
        }

        // Apply WHERE
        if (whereClause) {
            rows = rows.filter(r => {
                const match = whereClause.match(/([\w\.]+)\s*(=|<|>)\s*(.+)/);
                if (!match) return true;
                let [_, col, op, valRaw] = match;
                let val = valRaw.trim().replace(/^["']|["']$/g, '');
                if (!isNaN(val) && typeof r[col] === 'number') val = Number(val);
                switch (op) {
                    case '=': return r[col] == val;
                    case '<': return r[col] < val;
                    case '>': return r[col] > val;
                    default: return true;
                }
            });
        }

        let cols;
        if (rawCols === '*') {
            cols = rows[0] ? Object.keys(rows[0]) : [];
        } else {
            cols = rawCols.split(',').map(c => c.trim());
        }

        if (!cols.length) return notify('No columns to display');

        // Build table
        const tableEl = document.createElement('table');
        const thead = document.createElement('thead');
        const headRow = document.createElement('tr');
        cols.forEach(c => {
            const th = document.createElement('th');
            th.textContent = c;
            headRow.appendChild(th);
        });
        thead.appendChild(headRow);
        tableEl.appendChild(thead);

        const tbody = document.createElement('tbody');
        rows.forEach(r => {
            const tr = document.createElement('tr');
            cols.forEach(c => {
                const td = document.createElement('td');
                td.textContent = r[c] ?? '';
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        tableEl.appendChild(tbody);

        // Append to proper panel
        const targetPanel = joinTokens.length === 1 ? replResultsSingle : replResultsJoin;
        targetPanel.innerHTML = '';
        targetPanel.appendChild(tableEl);

    } catch (err) {
        console.error(err);
        notify('Error parsing SELECT command');
    }
}

// DELETE handler
function handleDelete(match) {
    const tableName = match[1];
    const id = parseInt(match[2]);
    if (!dbData[tableName]) return notify(`Table ${tableName} does not exist`);

    if (tableName === 'rentals') {
        const rental = dbData.rentals.find(r => r.id === id);
        if (rental) {
            const inv = dbData.inventory.find(i => i.name === rental.item);
            if (inv) {
                inv.available += rental.qty;
                inv.rented -= rental.qty;
            }
        }
    }

    dbData[tableName] = dbData[tableName].filter(r => r.id !== id);
    notify(`Deleted row with id=${id} from ${tableName}`);
    refreshTables();
}

// INSERT handler
function handleInsert(match) {
    const tableName = match[1];
    const cols = match[2].split(',').map(c => c.trim());
    const vals = match[3].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));

    if (!dbData[tableName]) return notify(`Table ${tableName} does not exist`);

    const newRow = {};
    cols.forEach((col, i) => {
        let val = vals[i];
        if (!col.includes('date') && !isNaN(val)) val = Number(val);
        newRow[col] = val;
    });

    const existingIds = dbData[tableName].map(r => r.id);
    newRow.id = existingIds.length ? Math.max(...existingIds) + 1 : 1;

    if (tableName === 'rentals') {
        const memberExists = dbData.members.some(m => m.name === newRow.member_name);
        if (!memberExists) return notify(`Member "${newRow.member_name}" does not exist`);

        const invItem = dbData.inventory.find(i => i.name === newRow.item);
        if (!invItem) return notify(`Item "${newRow.item}" does not exist`);

        if (newRow.qty > invItem.available) return notify(`Not enough available "${newRow.item}"`);

        newRow.available = invItem.available - newRow.qty;
        invItem.available -= newRow.qty;
        invItem.rented += newRow.qty;
    }

    dbData[tableName].push(newRow);
    notify(`Inserted new row into ${tableName}`);
    refreshTables();
}
        
window.execCommand = execCommand;

// REPL UI 
const replSection = document.getElementById('repl');
replInput.rows = 8;
replInput.style.width = '100%';
replInput.style.padding = '8px';
replInput.style.marginBottom = '10px';
replInput.style.resize = 'none';
replInput.style.overflowY = 'auto';
replInput.style.whiteSpace = 'pre-wrap';
replInput.style.wordBreak = 'break-word';
replInput.placeholder = 'Enter SQL-like CRUDE command or joinings then run to manipulate the data tables...';
replInput.style.width = '100%';
replInput.style.padding = '8px';
replInput.style.marginBottom = '10px';
replInput.addEventListener('input', () => {
    replInput.scrollTop = replInput.scrollHeight;
});

//run button
replBtn.textContent = 'Run';
replBtn.onclick = () => {
    const cmd = replInput.value.trim();
    if (cmd) {
        execCommand(cmd);
        replInput.value = '';
    }
};

// REPL Results Styling
[replResultsSingle, replResultsJoin].forEach(panel => {
    panel.style.marginTop = '10px';
    panel.style.maxHeight = '300px';
    panel.style.overflowY = 'auto';      // vertical scroll
    panel.style.overflowX = 'auto';      // horizontal scroll
    panel.style.background = '#1e1e1e';
    panel.style.padding = '10px';
    panel.style.borderRadius = '8px';
    panel.style.fontSize = '14px';

    // Optional: force table to display as block for horizontal scrolling
    panel.style.display = 'block';
    panel.style.whiteSpace = 'nowrap';
});


// Initial Table Load
window.onload = () => {
    refreshTables();
};

const modalTitle = document.getElementById('modal-title');
window.modalTitle = modalTitle;  // expose globally for form.js
