import Fetch from "./Fetch";
class serviceFetch{

    constructor(baseUrl){
        if (baseUrl==null){
            this.baseUrl = "http://127.0.0.1:8080";
        }else{
            this.baseUrl = baseUrl;
        }
        //this.api = new Fetch(this.baseUrl);
    }

    async getProvincias(){
        //const prov = await api.getProvincias();
        //return prov;
    }
}

export default serviceFetch;