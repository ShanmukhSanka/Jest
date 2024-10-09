import { baseURL } from "BaseURL";
import { makeAutoObservable, runInAction } from "mobx";

class DropdownStore {
    dataMap = {
        appCodes: { data: [], isLoading: false, error: null, endpoint: "appCpdes-metadata" },
        domainCodes: { data: [], isLoading: false, error: null, endpoint: "domainCodes-metadata" },
        sorCodes: { data: [], isLoading: false, error: null, endpoint: "sor-cds" },
    };

    constructor() {
        makeAutoObservable(this);
    }

    fetchData = async (type) => {
        const { endpoint } = this.dataMap[type];
        this.dataMap[type].isLoading = true;
        this.dataMap[type].error = null;

        try {
            const url = `${baseURL}${endpoint}?env=DEV`;
            const response = await fetch(url);
            const jsonData = await response.json();

            runInAction(() => {
                this.dataMap[type].data = Array.isArray(jsonData) ? jsonData : [];
                this.dataMap[type].isLoading = false;
            });
        } catch (error) {
            console.error(`FAILED TO RETRIEVE ${type}`, error);
            runInAction(() => {
                this.dataMap[type].error = `Failed to retrieve ${type}`;
                this.dataMap[type].isLoading = false;
            });
        }
    };

    getAppCodes = () => this.dataMap.appCodes.data;
    getDomainCodes = () => this.dataMap.domainCodes.data;
    getSorCodes = () => this.dataMap.sorCodes.data;

    isLoadingAppCodes = () => this.dataMap.appCodes.isLoading;
    isLoadingDomainCodes = () => this.dataMap.domainCodes.isLoading;
    isLoadingSorCodes = () => this.dataMap.sorCodes.isLoading;

    hasErrorAppCodes = () => this.dataMap.appCodes.error;
    hasErrorDomainCodes = () => this.dataMap.domainCodes.error;
    hasErrorSorCodes = () => this.dataMap.sorCodes.error;
}

const dropdownStore = new DropdownStore();
export default dropdownStore;
