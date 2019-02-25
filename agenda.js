(function(){
    //user interface
    var ui = {
        fields:document.querySelectorAll("input"),
        button:document.querySelector(".pure-button"),
        table:document.querySelector("table tbody") 
    };
    //actions
    //limpa campos após enviar
    var cleanFields = ()=>ui.fields.forEach(field=>field.value=""); //função anonima no JS6 = (paramentro)=>{código}

    //caso ocorra erro após enviar, chama essa função
    var genericError = function(){};

    //valida campos
    var validateFields = function(e){
        e.preventDefault();
        var errors = 0;
        var contact = {};
        ui.fields.forEach(function(field){
            if(field.value.trim().length === 0){
                field.classList.add("error");
                errors ++;
            }
            else{
                field.classList.remove("error");
                contact[field.id] = field.value.trim();
            }
        });

        if(errors > 0){
            document.querySelector(".error").focus();
        }else{
            addContact(contact);
            }
    };
    
    //Adiciona contato ao meu backend
    var addContact = function(contact){
        var endpoint = "http://localhost:4000/schedule"; //aponta para o meu backend
        var config = { //configura o envio de dados, no caso o post envia/ get pega os dados/delete remove os dados
          method:"Post",
          body:JSON.stringify(contact),
          headers: new Headers({
            "Content-type":"application/json" //vai entrar como json no backend
          })  
        };
        fetch(endpoint,config)
        .then(cleanFields)
        .then(getContacts)
        .catch(genericError);
    };
    //busca contatos
    var getContacts = function(){
        var endpoint = "http://localhost:4000/schedule";
        var config = {
          method:"Get",
          headers: new Headers({
            "Content-type":"application/json"
          })  
        };
        fetch(endpoint,config)
        .then(function(response){return response.json()}) //pega a resposta e transforma para o que voce quer utilizar
        .then(getContactsSuccess) //then executa quando der sucesso na conexao com o backend
        .catch(genericError); //catch quando der errado a conexão com o banco ele vai executar
    };

    //remove contato
    var removeContact = function(id){
        var endpoint = "http://localhost:4000/schedule/"+id;
        var config = {
            method:"DELETE",
            headers: new Headers({
            "Content-type":"application/json"
            })  
        };
        fetch(endpoint,config)
        .then(getContacts)
        .catch(genericError);
    }

    var getContactsSuccess = function(contacts){
        var tableRows = [];
        contacts.forEach(function(contact){//percorre cada contato e adiciona esse HTML
            tableRows.push(`
            <tr>
                <td>${contact.id}</td>
                <td>${contact.name}</td>
                <td>${contact.email}</td>
                <td>${contact.phone}</td>
                <td><a href="#" data-id="${contact.id}" data-action="delete">Excluir</a></td>
            </tr>
            `);
        });
        if(contacts.length === 0){
            tableRows.push(`
            <tr>
                <td colspan="5">Não existem dados registrados!</td>
            </tr>
            `)
        }
        ui.table.innerHTML = tableRows.join("");
    }

    var confirmRemove = function(e){
        e.preventDefault();
        if(e.target.dataset.action === "delete" && confirm("Deseja excluir este item" + e.target.dataset.id)){
            removeContact(e.target.dataset.id)
        }
    };
    
    //função para chamar os eventos ao carregar a página
    var init = function(){
        //adds events
        ui.button.onclick = validateFields;
        ui.table.onclick = confirmRemove;
        getContacts();

    }();//já declara e executa a função(função imediata)
})();