// Optional: Add interactivity if needed
// Example: Smooth scroll for navigation

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
// Gestion des tâches
function initTaskItem(item) {
    const checkbox = item.querySelector('.task-checkbox');
    const text = item.querySelector('.task-text');
    const deleteBtn = item.querySelector('.task-delete');
    
    // Gestion de la checkbox
    checkbox.addEventListener('click', (e) => {
        e.stopPropagation();
        checkbox.classList.toggle('checked');
        text.classList.toggle('completed');
    });
    
    // Gestion de la suppression
    if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Supprimer cette tâche ?')) {
                item.remove();
            }
        });
    }
}

// Initialiser toutes les tâches existantes
document.querySelectorAll('.task-item').forEach(initTaskItem);

// Fonction pour ajouter une nouvelle tâche
function addTask(category) {
    const taskList = category.querySelector('.task-list');
    const newItem = document.createElement('li');
    newItem.className = 'task-item';
    newItem.innerHTML = `
        <div class="task-checkbox"></div>
        <input type="text" class="task-text" value="Nouvelle tâche" placeholder="Entrez une tâche...">
        <button class="task-delete">🗑️</button>
        <button class="add-task-btn"> + Ajouter une tâche</button>
        
    `;
    taskList.appendChild(newItem);
    
    // Initialiser les événements de la nouvelle tâche
    initTaskItem(newItem);
    
    // Focus sur le champ de texte et sélectionner le texte
    const input = newItem.querySelector('.task-text');
    input.focus();
    input.select();
}

// Gestion des boutons "Ajouter une tâche"
// Utilise la délégation d'événements pour gérer aussi les boutons ajoutés dynamiquement
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-task-btn');
    if (!btn) return;
    const category = btn.closest('.category');
    if (category) addTask(category);
});

// Gestion du markdown (protégé si les éléments sont absents)
const editor = document.querySelector('.markdown-editor');
const preview = document.querySelector('.markdown-preview');

if (editor && preview && typeof marked !== 'undefined') {
    function updatePreview() {
        const markdown = editor.value;
        preview.innerHTML = marked.parse(markdown);
    }

    editor.addEventListener('input', updatePreview);
    updatePreview();
} else if ((editor || preview) && typeof marked === 'undefined') {
    // Si l'utilisateur a inclus l'éditeur mais pas la lib marked, éviter les erreurs
    console.warn('marked.js non disponible — aperçu markdown désactivé');
}

function initPatternItem(item) {
    const text = item.querySelector('.pattern-text');
    const deleteBtn = item.querySelector('.pattern-delete');

     // Focus sur le champ de texte et sélectionner le texte
    const input = newItem.querySelector('.pattern-text');
    input.focus();
    input.select();
}

    
// Gestion des paternes (utilise délégation et supporte suppression)
const patternList = document.querySelector('.pattern-list');
if (patternList) {
    // Helper pour normaliser un nom en clé (ex: "Paterne 1" -> "paterne-1")
    function normalizeName(name) {
        return name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
    }

    // Initialiser les paternes existants : ajouter data-pattern et bouton de suppression si manquants
    document.querySelectorAll('.pattern-item').forEach(item => {
        const text = item.textContent.trim();
        const key = normalizeName(text);
        item.dataset.pattern = item.dataset.pattern || key;
        // Si pas de bouton de suppression, en ajouter un
        if (!item.querySelector('.pattern-delete')) {
            // Retirer l'ancien texte pour éviter duplication si innerHTML est utilisé
            const nameOnly = text.replace(/\u0078|×|\u2215|🗑️/g, '').trim();
            item.innerHTML = `${nameOnly} <button class="pattern-delete" title="Supprimer">🗑️</button>`;
        }
    });
    // Délégation : clic sur un élément de la liste
    patternList.addEventListener('click', (e) => {
        const item = e.target.closest('.pattern-item');
        if (!item) return;

        // Si l'utilisateur a cliqué sur le bouton de suppression
        if (e.target.classList.contains('pattern-delete')) {
            e.stopPropagation();
            if (confirm('Supprimer ce paterne ?')) {
                item.remove();
            }
            return;
        }

        // Sinon, sélectionner le paterne
        document.querySelectorAll('.pattern-item').forEach(p => p.classList.remove('active'));
        item.classList.add('active');
    });

    // Bouton ajouter paterne (protégé si absent)
    const addPatternBtn = document.querySelector('.add-pattern-btn');
    if (addPatternBtn) {
        addPatternBtn.addEventListener('click', () => {
            const patternName = prompt('Nom du nouveau paterne:');
            if (patternName) {
                const newPattern = document.createElement('li');
                newPattern.className = 'pattern-item';
                const key = normalizeName(patternName);
                newPattern.dataset.pattern = key;
                newPattern.innerHTML = `${patternName} <button class="pattern-delete" title="Supprimer">🗑️</button>`;
                patternList.appendChild(newPattern);
                // Sélectionner le nouveau paterne
                document.querySelectorAll('.pattern-item').forEach(p => p.classList.remove('active'));
                newPattern.classList.add('active');
            }
        });
    }

    // Gérer les interactions avec les onglets : sélection, création de paterne associée et fermeture
    const tabs = document.querySelector('.tabs');
    if (tabs) {
        tabs.addEventListener('click', (e) => {
            const tab = e.target.closest('.tab');
            if (!tab) return;
            // Ignorer le bouton '+'
            if (tab.classList.contains('tab-add')) return;

            // Si on a cliqué sur la croix de fermeture
            if (e.target.classList.contains('tab-close')) {
                e.stopPropagation();
                if (confirm('Fermer cet onglet ?')) {
                    const key = tab.dataset.tab || normalizeName(tab.textContent.replace('×', '').trim());
                    // Supprimer le paterne associé si existe
                    const assoc = document.querySelector(`.pattern-item[data-pattern="${key}"]`);
                    if (assoc) assoc.remove();
                    tab.remove();
                }
                return;
            }

            // Sélectionner l'onglet
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Trouver ou créer le paterne associé
            const tabName = tab.textContent.replace('×', '').trim();
            const key = tab.dataset.tab || normalizeName(tabName);
            let targetPattern = document.querySelector(`.pattern-item[data-pattern="${key}"]`);
            if (!targetPattern) {
                targetPattern = document.createElement('li');
                targetPattern.className = 'pattern-item';
                targetPattern.dataset.pattern = key;
                targetPattern.innerHTML = `${tabName} <button class="pattern-delete" title="Supprimer">🗑️</button>`;
                patternList.appendChild(targetPattern);
            }
            document.querySelectorAll('.pattern-item').forEach(p => p.classList.remove('active'));
            targetPattern.classList.add('active');
        });
    }
}

// Gestion des onglets
document.querySelectorAll('.tab').forEach(tab => {
    const closeBtn = tab.querySelector('.tab-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Fermer cet onglet ?')) {
                tab.remove();
            }
        });
    }
});

document.querySelector('.tab-add').addEventListener('click', () => {
    const tabName = prompt('Nom du nouvel onglet:');
    if (tabName) {
        const tabs = document.querySelector('.tabs');
        const addBtn = document.querySelector('.tab-add');
        const newTab = document.createElement('button');
        newTab.className = 'tab';
        newTab.innerHTML = `${tabName} <span class="tab-close">×</span>`;
        tabs.insertBefore(newTab, addBtn);
        
        // Ajouter l'événement de fermeture au nouveau bouton
        const newCloseBtn = newTab.querySelector('.tab-close');
        newCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Fermer cet onglet ?')) {
                newTab.remove();
            }
        });
    }
});