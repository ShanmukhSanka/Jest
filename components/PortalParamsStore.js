import { baseURL } from "../BaseURL";
import { makeAutoObservable, runInAction } from "mobx";

class PortalParamStore {
    prmotn_flag = [];
    ownrshp_team = [];
    prcsng_type = [];
    load_type = [];

    constructor() {
        makeAutoObservable(this);
    }

    fetchReturnJobParamsfunc = async () => {
        try {
            const url = `${baseURL}processing/return-job-parms`;
            const response = await fetch(url);
            const jsonData = await response.json();
            console.log(jsonData, 'JSONDATA');

            runInAction(() => {
                this.prmotn_flag = Array.isArray(jsonData.prmotn_flag) ? jsonData.prmotn_flag : [];
                this.ownrshp_team = Array.isArray(jsonData.ownrshp_team) ? jsonData.ownrshp_team : [];
                this.prcsng_type = Array.isArray(jsonData.prcsng_type) ? jsonData.prcsng_type : [];
                this.load_type = Array.isArray(jsonData.load_type) ? jsonData.load_type : [];
            });
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };
}

const portalParamStore = new PortalParamStore();
export default portalParamStore;
