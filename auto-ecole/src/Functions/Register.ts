import axios from "axios";
import { socket } from "@/pages/_app";

const registerAutoEcole = async (e: React.FormEvent<HTMLFormElement>, setRegister: React.Dispatch<React.SetStateAction<boolean>>, setRegisterError: React.Dispatch<React.SetStateAction<string>>, setToken: React.Dispatch<React.SetStateAction<string>>, selectedFile: File | null) => {
    e.preventDefault();


    // voir avec lucas si on fait pas plutot des useState
    const name = (document.getElementById('auto-ecole-nom') as HTMLInputElement);
    const mail = (document.getElementById('auto-ecole-email') as HTMLInputElement);
    const password = (document.getElementById('auto-ecole-password') as HTMLInputElement);
    const address = (document.getElementById('auto-ecole-address') as HTMLInputElement);
    const zip = (document.getElementById('auto-ecole-zip') as HTMLInputElement);
    const city = (document.getElementById('auto-ecole-city') as HTMLInputElement);
    const pics = (document.getElementById('auto-ecole-photo') as HTMLInputElement);
    // modifier ça pour quand on aura plusieurs profs
    const prof1 = (document.getElementById('auto-ecole-prof1') as HTMLInputElement);
    const prof2 = (document.getElementById('auto-ecole-prof2') as HTMLInputElement);
    const phone = (document.getElementById('auto-ecole-phone') as HTMLInputElement);
    const card = (document.getElementById('auto-ecole-carte') as HTMLInputElement);
    const cheque = (document.getElementById('auto-ecole-cheque') as HTMLInputElement);
    const especes = (document.getElementById('auto-ecole-especes') as HTMLInputElement);
    const qualiopi = (document.getElementById('auto-ecole-qualiopi') as HTMLInputElement);
    const label_qualite = (document.getElementById('auto-ecole-label-qualite') as HTMLInputElement);
    const qualicert = (document.getElementById('auto-ecole-qualicert') as HTMLInputElement);
    const garantie_fin = (document.getElementById('auto-ecole-garantie-fin') as HTMLInputElement);
    const datadocke = (document.getElementById('auto-ecole-datadocke') as HTMLInputElement);
    const cpf = (document.getElementById('auto-ecole-cpf') as HTMLInputElement);
    const aide_apprentis = (document.getElementById('auto-ecole-aide-apprentis') as HTMLInputElement);
    const permis1 = (document.getElementById('auto-ecole-permis1') as HTMLInputElement);
    const fin_francetravail = (document.getElementById('auto-ecole-fin-francetravail') as HTMLInputElement);
    // modifier ça pour quand on aura plusieurs formations
    const formations = [(document.getElementById('auto-ecole-formation1') as HTMLInputElement), (document.getElementById('auto-ecole-formation2') as HTMLInputElement)];
    // modifier ça pour quand on aura plusieurs étudiants
    const students = (document.getElementById('auto-ecole-mails-etudiants') as HTMLInputElement);

    console.log(selectedFile);

    const data = {
        name: name.value,
        mail: mail.value,
        password: password.value,
        address: address.value,
        zip: zip.value,
        city: city.value,
        pics: selectedFile,
        // modifier ça pour quand on aura plusieurs profs
        monitors: [prof1.value, prof2.value],
        phone: phone.value,
        card: card.checked,
        cheque: cheque.checked,
        especes: especes.checked,
        qualiopi: qualiopi.checked,
        label_qualite: label_qualite.checked,
        qualicert: qualicert.checked,
        garantie_fin: garantie_fin.checked,
        datadocke: datadocke.checked,
        cpf: cpf.checked,
        aide_apprentis: aide_apprentis.checked,
        permis1: permis1.checked,
        fin_francetravail: fin_francetravail.checked,
        formations: [formations[0].value, formations[1].value],
        students: [students.value]
    };

    let formData = new FormData();
    formData.append('name', data.name);
    formData.append('mail', data.mail);
    formData.append('password', data.password);
    formData.append('address', data.address);
    formData.append('zip', data.zip);
    formData.append('city', data.city);
    formData.append('pics', data.pics as Blob);
    formData.append('monitors', JSON.stringify(data.monitors));
    formData.append('phone', data.phone);
    formData.append('card', data.card.toString());
    formData.append('cheque', data.cheque.toString());
    formData.append('especes', data.especes.toString());
    formData.append('qualiopi', data.qualiopi.toString());
    formData.append('label_qualite', data.label_qualite.toString());
    formData.append('qualicert', data.qualicert.toString());
    formData.append('garantie_fin', data.garantie_fin.toString());
    formData.append('datadocke', data.datadocke.toString());
    formData.append('cpf', data.cpf.toString());
    formData.append('aide_apprentis', data.aide_apprentis.toString());
    formData.append('permis1', data.permis1.toString());
    formData.append('fin_francetravail', data.fin_francetravail.toString());
    formData.append('formations', JSON.stringify(data.formations));
    formData.append('students', JSON.stringify(data.students));

    // socket.emit('registerAutoEcole', data);
    try {
        const response = await axios.post('http://localhost:3500/registerAutoEcole', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        setRegister(response.data.register);
        response.data.register === false ? setRegisterError('Problème lors de l\'enregistrement') : setRegisterError('');
        response.data.register === true ? setToken(response.data.token) : setToken('');
    } catch (error) {
        console.log(error);
    }

};

const registerChercheur = async (e: React.FormEvent<HTMLFormElement>, setRegister: React.Dispatch<React.SetStateAction<boolean>>, setRegisterError: React.Dispatch<React.SetStateAction<string>>, setToken: React.Dispatch<React.SetStateAction<string>>) => {
    e.preventDefault();

    const mail = (document.getElementById('nouveau-email') as HTMLInputElement);
    const password = (document.getElementById('nouveau-password') as HTMLInputElement);
    const notifs = (document.getElementById('nouveau-notifs') as HTMLInputElement);

    const data = {
        mail: mail.value,
        password: password.value,
        notifs: notifs.checked,
    };

    try {
        // const response = await axios.post('http://localhost:3500/registerChercheur', data);
        // setRegister(response.data.register);
        // response.data.register === false ? setRegisterError('Problème lors de l\'enregistrement') : setRegisterError('');
        // response.data.register === true ? setToken(response.data.token) : setToken('');
        socket.emit('registerChercheur', data);
        socket.on('registerChercheur', (data: any) => {
            if (data.register) {
                setRegister(true);
                setToken(data.token);
            } else {
                setRegisterError('Problème lors de l\'enregistrement');
            }
        });
    } catch (error) {
        console.log(error);
    }
};

export { registerAutoEcole, registerChercheur };