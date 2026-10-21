AOS.init({
    duration: 680,
    once: true,
    offset: 55
});

var providerCsvUrl = 'https://docs.google.com/spreadsheets/d/1NiiFzCDYIB1LidRPUsYeauZjMR6fAOAWaBS9Vj0i0fE/export?format=csv&gid=704323197',
    validProviderCategories = [
        'all',
        'sales-services',
        'materials-equipment',
        'board-lodging',
        'catering-services'
    ],
    params = new URLSearchParams(window.location.search),
    requestedCategory = params.get('category'),
    activeCategory = validProviderCategories.indexOf(requestedCategory) !== -1 ? requestedCategory : 'all',
    searchInput = document.getElementById('providerSearch'),
    providerGrid = document.getElementById('providerGrid'),
    providerLoadStatus = document.getElementById('providerLoadStatus'),
    providerLoadError = document.getElementById('providerLoadError'),
    providerEmpty = document.getElementById('providerEmpty'),
    providers = [];

function updateProviderUrl() {
    var url = new URL(window.location.href);
    url.searchParams.set('category', activeCategory);
    if (searchInput.value.trim()) {
        url.searchParams.set('q', searchInput.value.trim());
    } else {
        url.searchParams.delete('q');
    }
    window.history.replaceState(null, '', url);
}

function parseCsv(csv) {
    var rows = [],
        row = [],
        value = '',
        insideQuotes = false;

    for (var i = 0; i < csv.length; i += 1) {
        var character = csv[i];

        if (insideQuotes) {
            if (character === '"' && csv[i + 1] === '"') {
                value += '"';
                i += 1;
            } else if (character === '"') {
                insideQuotes = false;
            } else {
                value += character;
            }
        } else if (character === '"' && value.length === 0) {
            insideQuotes = true;
        } else if (character === ',') {
            row.push(value);
            value = '';
        } else if (character === '\n' || character === '\r') {
            row.push(value);
            if (row.some(function(cell) { return cell.trim() !== ''; })) rows.push(row);
            row = [];
            value = '';
            if (character === '\r' && csv[i + 1] === '\n') i += 1;
        } else {
            value += character;
        }
    }

    if (value.length || row.length) {
        row.push(value);
        if (row.some(function(cell) { return cell.trim() !== ''; })) rows.push(row);
    }

    return rows;
}

function getProviderCategory(service) {
    var normalizedService = service.toLowerCase().replace(/\s+/g, ' ');

    if (normalizedService.indexOf('sales & services') !== -1) {
        return { id: 'sales-services', label: 'Sales & Services', icon: 'bi-building' };
    }
    if (normalizedService.indexOf('materials & equipments') !== -1) {
        return { id: 'materials-equipment', label: 'Materials & Equipments', icon: 'bi-box-seam' };
    }
    if (normalizedService.indexOf('board & lodging') !== -1) {
        return { id: 'board-lodging', label: 'Board & Lodging', icon: 'bi-building-check' };
    }
    if (normalizedService.indexOf('catering services') !== -1) {
        return { id: 'catering-services', label: 'Catering Services', icon: 'bi-cup-hot' };
    }

    return { id: 'other', label: service.trim() || 'Other Services', icon: 'bi-building' };
}

function getCell(row, index) {
    return index === -1 ? '' : (row[index] || '').trim();
}

function parseProviders(csv) {
    var rows = parseCsv(csv),
        headerIndex = rows.findIndex(function(row) {
            return row.some(function(cell) {
                return cell.trim().toLowerCase() === 'name of provider';
            });
        });

    if (headerIndex === -1) throw new Error('The provider registry header was not found.');

    var headers = rows[headerIndex].map(function(cell) { return cell.trim().toLowerCase(); }),
        nameIndex = headers.indexOf('name of provider'),
        serviceIndex = headers.indexOf('offered services'),
        emailIndex = headers.indexOf('email'),
        contactIndex = headers.indexOf('contact number');

    if (nameIndex === -1 || serviceIndex === -1 || emailIndex === -1 || contactIndex === -1) {
        throw new Error('The provider registry is missing one or more required columns.');
    }

    return rows.slice(headerIndex + 1).reduce(function(list, row) {
        var name = getCell(row, nameIndex);
        if (!name) return list;

        var services = getCell(row, serviceIndex);
        list.push({
            name: name,
            services: services,
            email: getCell(row, emailIndex),
            contact: getCell(row, contactIndex),
            category: getProviderCategory(services)
        });
        return list;
    }, []);
}

function appendProviderDetail(container, iconName, value, isEmail) {
    if (!value || value === '-') return;

    var detail = document.createElement('div'),
        icon = document.createElement('i'),
        content = document.createElement('div');

    detail.className = 'provider-card-meta-item';
    icon.className = 'bi ' + iconName;
    icon.setAttribute('aria-hidden', 'true');
    content.className = 'provider-contact-value';

    if (isEmail) {
        value.split(/\n+/).map(function(email) { return email.trim(); }).filter(Boolean).forEach(function(email, index) {
            if (index > 0) content.appendChild(document.createElement('br'));
            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                var link = document.createElement('a');
                link.href = 'mailto:' + email;
                link.textContent = email;
                content.appendChild(link);
            } else {
                content.appendChild(document.createTextNode(email));
            }
        });
    } else {
        content.textContent = value.split(/\n+/).map(function(phone) {
            return phone.trim();
        }).filter(Boolean).join(' | ');
    }

    detail.appendChild(icon);
    detail.appendChild(content);
    container.appendChild(detail);
}

function renderProviders() {
    providerGrid.replaceChildren();

    providers.forEach(function(provider) {
        var column = document.createElement('div'),
            card = document.createElement('article'),
            identity = document.createElement('div'),
            category = document.createElement('div'),
            name = document.createElement('h2'),
            details = document.createElement('div');

        column.className = 'col-12 provider-card';
        column.setAttribute('data-provider-category', provider.category.id);

        card.className = 'provider-card-content';
        identity.className = 'provider-card-identity';
        category.className = 'provider-category-label';
        category.textContent = provider.category.label;
        name.textContent = provider.name;
        details.className = 'provider-card-meta';
        appendProviderDetail(details, 'bi-envelope', provider.email, true);
        appendProviderDetail(details, 'bi-telephone', provider.contact, false);

        identity.appendChild(category);
        identity.appendChild(name);
        card.appendChild(identity);
        card.appendChild(details);
        column.appendChild(card);
        providerGrid.appendChild(column);
    });
}

function filterProviders() {
    var searchTerm = searchInput.value.trim().toLowerCase(),
        visibleCount = 0;

    document.querySelectorAll('.provider-filter').forEach(function(button) {
        var selected = button.getAttribute('data-provider-filter') === activeCategory;
        button.classList.toggle('active', selected);
        button.setAttribute('aria-pressed', String(selected));
    });

    providerGrid.querySelectorAll('.provider-card').forEach(function(card) {
        var categoryMatches = activeCategory === 'all' ||
            card.getAttribute('data-provider-category') === activeCategory;
        var textMatches = !searchTerm || card.textContent.toLowerCase().indexOf(searchTerm) !== -1;
        var visible = categoryMatches && textMatches;

        card.classList.toggle('d-none', !visible);
        if (visible) visibleCount += 1;
    });

    providerEmpty.classList.toggle('d-none', visibleCount > 0);
    providerLoadStatus.textContent = 'Showing ' + visibleCount + ' of ' + providers.length + ' providers.';
    updateProviderUrl();
}

function loadProviders() {
    providerLoadError.classList.add('d-none');
    providerLoadStatus.classList.remove('d-none');
    providerLoadStatus.textContent = 'Loading provider listings...';

    fetch(providerCsvUrl, { cache: 'no-store' })
        .then(function(response) {
            if (!response.ok) throw new Error('Provider registry request failed with status ' + response.status + '.');
            return response.text();
        })
        .then(function(csv) {
            providers = parseProviders(csv);
            if (!providers.length) throw new Error('The provider registry did not contain any provider records.');
            renderProviders();
            filterProviders();
        })
        .catch(function(error) {
            console.error('Unable to load the provider registry:', error);
            providerLoadStatus.classList.add('d-none');
            providerLoadError.classList.remove('d-none');
        });
}

searchInput.value = params.get('q') || '';
document.querySelectorAll('.provider-filter').forEach(function(button) {
    button.addEventListener('click', function() {
        activeCategory = this.getAttribute('data-provider-filter');
        searchInput.value = '';
        filterProviders();
    });
});

document.getElementById('providerSearchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    filterProviders();
});

searchInput.addEventListener('input', filterProviders);

window.addEventListener('scroll', function() {
    document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
    document.getElementById('btt').classList.toggle('show', window.scrollY > 300);
});

document.getElementById('btt').addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('providerRetry').addEventListener('click', loadProviders);
loadProviders();
