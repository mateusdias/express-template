import {Request, RequestHandler, Response} from "express";

/*
    Nampespace que contém tudo sobre "contas de usuários"
*/
export namespace AccountsHandler {
    
    /**
     * Tipo UserAccount
     */
    export type UserAccount = {
        name:string;
        email:string;
        password:string;
        birthdate:string; 
    };

    // Array que representa uma coleção de contas. 
    let accountsDatabase: UserAccount[] = [];

    /**
     * Salva uma conta no banco de dados. 
     * @param ua conta de usuário do tipo @type {UserAccount}
     * @returns @type { number } o código da conta cadastrada como posição no array.
     */
    export function saveNewAccount(ua: UserAccount) : number{
        accountsDatabase.push(ua);
        return accountsDatabase.length;
    }
    
    export function GetAllAcounts() {
        return accountsDatabase;
    }

    function VerificarEmail(email:string): boolean{
        let valid =  false
        const account =  accountsDatabase.find(a => {
            if (a.email === email){
                valid = true;
                return;
            }
        })
        return valid;



    }




    export function Authenticate(email:string, password:string): boolean {
        let valid:boolean = false;
        const account = accountsDatabase.find(a =>{
            if(a.email === email && a.password === password){
                valid = true;
                return;
            }
        })
        return valid;
        
    }


    /**
     * Função para tratar a rota HTTP /signUp. 
     * @param req Requisição http tratada pela classe @type { Request } do express
     * @param res Resposta http a ser enviada para o cliente @type { Response }
     */
    export const createAccountRoute: RequestHandler = (req: Request, res: Response) => {
        // Passo 1 - Receber os parametros para criar a conta
        const pName = req.get('name');
        const pEmail = req.get('email');
        const pPassword = req.get('password');
        const pBirthdate = req.get('birthdate');
        
        if(pName && pEmail && pPassword && pBirthdate){

            // prosseguir com o cadastro... 
            if(VerificarEmail(pEmail)){ 
                res.statusCode =400;
                res.send('Email já cadastrado!');
            }
            else { 
            const newAccount: UserAccount = {
                name: pName,
                email: pEmail, 
                password: pPassword,
                birthdate: pBirthdate
            }
            const ID = saveNewAccount(newAccount);
            res.statusCode = 200; 
            res.send(`Nova conta adicionada. Código: ${ID}`);
        }
        
        }
        else{
            res.statusCode = 400;
            res.send("Parâmetros inválidos ou faltantes.");
        }

}


    export const loginHandler: RequestHandler = (req:Request, res: Response) => {
        const pEmail =  req.get('email');
        const pPassword = req.get('senha');

        if(pEmail && pPassword){
            if (Authenticate(pEmail,pPassword)){
                res.statusCode = 200;
                res.send('Conta acessada com sucesso!');

            }
            else {
                res.statusCode = 400;
                res.send('Acesso Inválido!');
            }
        }


    }

}
