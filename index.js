// { name: string, surname: string, lastName?: string, contacts?: object[] }

const addUser = document.getElementById("addUser")
const url = "http://localhost:3000"

const user = {
    name: "Георгий",
    surname: "Кузнецов",
    lastName: "Максимович",
    contacts: []
}

function postData(user) {
    const options = {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            'content-type': 'application/json'
        }
    }
    fetch(url + "/api/clients", options)
        .then((response) => { return response.json() })
        .then((result) => {
            console.log(result)
        })
        .catch(err => {
            console.log(err)
        })
}



function getData() {
    fetch(url + "/api/clients")
        .then((response) => { return response.json() })
        .then((result) => {
            console.log(result)
        })
        .catch(err => {
            console.log(err)
        })
}


// postData(user)
getData()



addUser.addEventListener('click',  ()=>{
            document.body.innerHTML +=  ` <div>
        <form id = "addForm" action="#">
            <input name="name" type="text" placeholder="введите имя ">
            <input name="surname" type="text" placeholder="введите фамилию">
            <input name="lastName type="text" placeholder="введите отчество">
            <button id="saveUser" type="submit">Сохранить</button>
        </form>
    </div>`
    const form = document.getElementById('addForm')
    form.addEventListener('submit', (event)=>{

        event.preventDefault()
        const formData = new FormData(form);

        console.log(formData.get("name"))
        const user = {
            name: formData.get("name"),
            surname: formData.get("surname"),
            lastName: formData.get("lastName"),
            contacts: []
        }
        postData(user)


    })

})