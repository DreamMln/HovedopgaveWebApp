
const baseUrl = "https://localhost:44327/api/Borger";

const borger = Vue.createApp({
    data() {
        return {
			regiArray: [], //tomt array til at indeholde data omkring borgere
			pauseArray: [], //tomt array til at indeholde data omkring borgere
			//obj. in another obj.
			addRegi:{
				ind: "",
				ud: "",
			},
			addPause:{
				pauseStart: "",
				pauseSlut: ""
			},
            noteArray: [], //tomt array til at indeholde data omkring borgernoter
			//json obj - skal hedde det samme
			addNote:{
				noteID: 0,
				noteOmBorger: "",
				datoTid: null,
			},
			error: '',
			deleteNote: "",
			hentBorgerData: "",
			result: null,
			//add the message html
			addMessage: "",
			deleteMessage: "",
			id: 0,
			//opret navn
			outputTlfData: "",
			navn: "",
			//udregn procent
			samletTid: 0,
        	pauseTid: 0,
        	effektivitet: null,
        	arbejdstid: 0,

			showAllregi: false,
			showAllpause: false
		}
    },
	created(){
		// created() is a life cycle method, not an ordinary method, is called automatically when the page is reloaded
		//uri - er en del af url, søger i min url efter ...
		let uri = window.location.search.substring(1);
		//læser id'et der bliver videresendt
		let urlParameters = new URLSearchParams(uri);
		let id = urlParameters.get('id')
		console.log("ID:" + id)
		//videresender værdien, sammen med baseurl
		this.getRoutingBorger(baseUrl, id)
        //created, kalder dem, istedet for this.id,
		this.getAllRegi(baseUrl, id)
		this.getAllNoter(baseUrl, id)
		this.getAllPauser(baseUrl, id)
	},
	computed: {
		visibleRegiArray() {
			if (this.showAllregi) {
				return this.regiArray;
			} else {
				// Return a limited number of registration entries based on your desired limit
				return this.regiArray.slice(0, 1);
			}
		},
		visiblePauseArray() {
			if (this.showAllpause) {
				return this.pauseArray;
			} else {
				// Return a limited number of registration entries based on your desired limit
				return this.pauseArray.slice(0, 3);
			}
		}
	},
	methods: {
		//Get borger by id
		async getRoutingBorger(url, id){
			try{
				this.borgerID = id;
				const result = await axios.get(url + "/" + id)
				console.log(url + "/" + id)
				this.hentBorgerData = result.data
                console.log(result)
			}catch (ex) { //exception
			    alert(ex.message)
		    }
		},

		/////////BORGER REGISTRERINGER//////
		async getAllRegi(url, id){
			try{
			//response with axios
			//det er en borger, derfor id og regi sti, kig i controlleren
			const response = await axios.get(url + "/" + id + "/BorgerRegistreringer")
			this.regiArray = await response.data
			}
		catch(ex){
			alert("Fejl get all regi " + ex.message)
			}
		},
		/////////BORGER PAUSER//////
		async getAllPauser(url, id){
			try{
			//response with axios
			//det er en borger, derfor id og pause sti, kig i controlleren
			const response = await axios.get(url + "/" + id + "/BorgerPauser")
			this.pauseArray = await response.data
			}
		catch(ex){
			alert("Fejl get all regi " + ex.message)
			}
		},

		async opretRegiBorger(url, id){
			console.log(this.addRegi)
			try{
				const response = await axios.post(url + "/" + id + "/BorgerRegistreringer", this.addRegi)
				//response = await axios.post(baseUrl, this.addRegi)
				this.addRegi = response.status + " " + response.statusText
				this.getAllRegi(url, id)
				console.log(this.regiArray)
			}
			catch(ex){
				{alert("Fejl i add regi " + ex.message)}
                // alert("Fejl! Der er noget galt " + response.status)
			}
		},

		///////BORGER NOTER/////
		async getAllNoter(url, id){
			try{
			//det er en borger, derfor id og note sti, kig i controlleren
			//const response = await axios.get(url + "/" + noteOmBorger + id)
			//response with axios
			const response = await axios.get(url + "/" + id + "/BorgerNoter")
			this.noteArray = await response.data
			}
		catch(ex){
			{alert("Fejl i hent alle noter " + ex.message)}
		}
		},
		async opretNote(id){
			console.log(this.addNote)
				// validate logic
				// Validate date input
				if (!this.addNote.datoTid) {
					this.error = 'Dato må ikke være tom!';
					return;
				  }
				  //Clear alle tidligere error beskeder
				  this.error = '';
			try{
				const response = await axios.post(baseUrl + "/" + id + "/BorgerNoter", this.addNote)
				//this.addNote = "Responskode: " + response.status + " " + response.statusText
				this.getAllNoter(baseUrl, id)
				console.log(this.noteArray)
			}
			catch(ex){
				{alert("Note skal være udfyldt korrekt! " + ex.message)}
			}
		},
		//sletter kun en gang, brug log flere steder
		//borgerens id men kan ikke finde notens id - igang
		async sletNote(noteID){
			console.log(this.deleteNote)
			try{
				// const noteID = this.deleteNote.noteID;
				// if (!noteID) {
				// 	throw new Error("noteID er ikke defineret!");
				// }
				const response = await axios.delete(baseUrl + "/" + this.hentBorgerData.id + "/BorgerNoter" + "?noteID=" + noteID)
				console.log(response)

				this.deleteNote = "Responskode:" + response.status + response.statusText;
				console.log("Responskode:" + response.status + response.statusText)

				if(response.status === 200){
					await this.getAllNoter(baseUrl, this.hentBorgerData.id)
					console.log(this.noteArray)
				}else{
					console.error("kunne ikke slette note: " + response.statusText)
				}
			}
			catch(ex){
				{alert("Fejl! Slet en note " + ex.message)}
			}
		},
		//https://www.roskilde.dk/da-dk/forside/
		beregnEffektivitet() {
			this.arbejdstid = this.samletTid - this.pauseTid;
			this.effektivitet = (this.arbejdstid / this.samletTid) * 100;
			// toFixed(2); Afrunder til 2 decimaler
			this.effektivitet = this.effektivitet.toFixed(2);
		  },
		//PO der skriver borgerens navn ind
		async navnInput() {
			console.log(this.hentBorgerData)
			try{
				await axios.put(baseUrl + "/" + this.hentBorgerData.id + "?navn=" + this.hentBorgerData.navn, this.hentBorgerData)
				console.log(baseUrl + "/" + this.hentBorgerData.id + "?navn=" + this.hentBorgerData.navn, this.hentBorgerData)
				this.getRoutingBorger(baseUrl, this.hentBorgerData.id)
				alert("Navnet er opdateret til - " + this.hentBorgerData.navn + " ");
			}catch(error){
            alert("Fejl! I Opret navn!" + error.message)
		}
		},
	}
})
borger.mount("#borger") //her bliver appen mounted
