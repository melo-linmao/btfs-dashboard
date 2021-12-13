import xhr from "axios/index";

class APIClient10 {

    constructor() {
        this.apiUrl = localStorage.getItem('NODE_URL') ? localStorage.getItem('NODE_URL') : "http://localhost:5001";
        this.request = async (url, body, config) => {

            return new Promise(async (resolve, reject) => {
                try {
                    let {data} = await xhr.post(
                        this.apiUrl + url,
                        {
                            ...body
                        },
                        {...config}
                    );

                    resolve(data);
                }
                catch (e) {
                    let message;
                    if (e.response && e.response.status === 500) {
                        message = e.response['data']['Message'];
                    }
                    if (e.response && e.response.status === 400) {
                        message = e.response['data'];
                    }
                    resolve({
                        Type: 'error',
                        Message: message
                    });
                }
            }).catch(err => {
                console.log(err)
            });
        }
    }

    setApiUrl(url) {
        this.apiUrl = url;
    }

    getHostInfo() {
        return this.request('/api/v1/id');
    }

    getHostScore() {
        return this.request('/api/v1/storage/stats/info?l=false');
    }

    getHostPrice() {
        return this.request('/api/v1/cheque/price');
    }

    getHostScoreHistory(from, to) {
        return this.request('/api/v1/storage/stats/list?arg=' + from + '&arg=' + to);
    }

    getHostConfig() {
        return this.request('/api/v1/config/show');
    }

    getChainInfo() {
        return this.request('/api/v1/cheque/chaininfo');
    }

    getChequeAddress() {
        return this.request('/api/v1/vault/address');
    }

    getChequeBookBalance() {
        return this.request('/api/v1/vault/balance');
    }

    getChequeBTTBalance(address) {
        return this.request('/api/v1/cheque/bttbalance?arg=' + address);
    }

    getChequeWBTTBalance(address) {
        return this.request('/api/v1/vault/wbttbalance?arg=' + address);
    }

    getChequeValue() {
        return this.request('/api/v1/settlement/list');
    }

    getChequeTotalIncomeNumbers() {
        return this.request('/api/v1/cheque/receive-total-count');
    }

    getChequeTotalExpenseNumbers() {
        return this.request('/api/v1/cheque/send-total-count');
    }

    getChequeCashingList(offset, limit) {
        return this.request('/api/v1/cheque/receivelist?arg=' + offset + '&arg=' + limit);
    }

    getChequeExpenseList() {
        return this.request('/api/v1/cheque/sendlist');
    }

    getFilesStorage() {
        return this.request('/api/v1/repo/stat?human=true');
    }

    getContracts() {
        return this.request('/api/v1/storage/contracts/list/host');
    }

    getNetworkFlow() {
        return this.request('/api/v1/stats/bw');
    }

    getPeers() {
        return this.request('/api/v1/swarm/peers?latency=true');
    }

    getRootHash() {
        return this.request('/api/v1/files/stat?arg=%2F');
    }

    getHashByPath(path) {
        return this.request('/api/v1/files/stat?arg=' + path);
    }

    getFiles(hash) {
        return this.request('/api/v1/ls?arg=' + hash);
    }

    getFileStat(hash) {
        return this.request('/api/v1/files/stat?arg=/btfs/' + hash);
    }

    getFolder(hash, body, config) {
        return this.request('/api/v1/get?arg=' + hash + '&archive=true', body, config);
    }

    catFile(hash, body, config) {
        return this.request('/api/v1/cat?arg=' + hash, body, config);
    }

    getPrivateKey() {
        return this.request('/api/v1/cheque/chaininfo');
    }

    withdraw(amount) {
        return this.request('/api/v1/vault/withdraw?arg=' + amount);
    }

    deposit(amount) {
        return this.request('/api/v1/vault/deposit?arg=' + amount);
    }

    cash(id) {
        return this.request('/api/v1/cheque/cash?arg=' + id);
    }

    addPeer(id) {
        return this.request('/api/v1/swarm/connect?arg=' + id);
    }

    copy(from, to) {
        return this.request('/api/v1/files/cp?arg=' + from + '&arg=' + to);
    }

}

const Client10 = new APIClient10();

export default Client10;