import { githubUsers } from "./githubUsers.js";

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-fav')) || [];
    }

    save() {
        localStorage.setItem('@github-fav', JSON.stringify(this.entries));
    }

    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login === username);

            if (userExists) {
                throw new Error('Usúario já cadastrado!')
            }

            const user = await githubUsers.search(username);

            if (user.login === undefined) {
                throw new Error('Usúario não existe!')
            }

            this.entries = [user, ...this.entries];
            this.update();
            this.save();
        } catch (error) {
            alert(error.message);
        }

    }

    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEntries;
        this.update()
        this.save()
    }
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector('table tbody');
        this.update()
        this.onadd()
    }

    update() {
        this.removeAllTr();

        this.entries.forEach(user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = `${user.name}`;
            row.querySelector('.user span').textContent = `${user.login}`;
            row.querySelector('.repositories').textContent = `${user.public_repos}`;
            row.querySelector('.followers').textContent = `${user.followers}`;

            this.tbody.append(row);

            row.querySelector('.remove').onclick = () => {
                this.delete(user)
            }
        })

        const empty = this.root.querySelector('.empty');

        if (this.entries.length === 0) {
            empty.classList.remove('hide');
        } else {
            empty.classList.add('hide');
        }
    }

    onadd() {
        const addButton = this.root.querySelector('.search button');
        addButton.onclick = () => {
            const { value } = this.root.querySelector(".input-search");

            this.add(value)
        }
    }

    createRow() {
        const tr = document.createElement('tr');

        tr.innerHTML = `
        <tr>
            <td class="user">
            <img
                src="https://github.com/sarahvjustino.png"
                alt="Foto de Sarah Victoria"
            />
            <a href="https://github.com/sarahvjustino" target="_blank">
                <p>Sarah Victoria</p>
                <span>/sarahvjustino</span>
            </a>
            </td>

            <td class="repositories">25</td>

            <td class="followers">65</td>

            <td><button class="remove">Remover</button></td>
        </tr>
        `

        return tr;
    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr').forEach(tr => {
            tr.remove()
        });
    }
}