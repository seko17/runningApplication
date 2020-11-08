class User{
    // key?: string;
    uid?: string;
    name: string;
    gender: string;
    age: number;
    password:string;
    // ethnicity: string;


    constructor(){}

    public setUid(id: string){
        this.uid = id;
    }
    public getUid(id: string){
        return this.uid;
    }
    public setName(name: string){
        this.name = name;
    }
    public getName(id: string){
        return this.name;
    }
    // public setGender(id: string){
    //     this.uid = id;
    // }
    // public setUid(id: string){
    //     this.uid = id;
    // }
    // public setUid(id: string){
    //     this.uid = id;
    // }
    // public setUid(id: string){
    //     this.uid = id;
    // }
    // public setUid(id: string){
    //     this.uid = id;
    // }
    // public setUid(id: string){
    //     this.uid = id;
    // }
}