export class Database {
    constructor() {
      this.dbName = "visitas";
      this.version = 1;
    }
    // Método: para abrir conexión
    connect() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.version);
  
        request.onerror = (event) => {
          console.error("Error al conectar con la base de datos:", event.target.error);
          reject(event.target.error);
        };
  
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
  
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          console.log("Base de datos creada/actualizada:", db);
  
          if (!db.objectStoreNames.contains("visitas")) {
            const store = db.createObjectStore("visitas", { autoIncrement: true });
            store.createIndex("rut", "rut", { unique: true });
          }
        };
      });
    }
  
    async getAll() {
      const db = await this.connect();
      return new Promise((resolve, reject) => {
        const txn = db.transaction("visitas", "readonly");
        const store = txn.objectStore("visitas");
        const query = store.getAll();
  
        query.onsuccess = () => resolve(query.result);
        query.onerror = (event) => reject(event.target.error);
  
        txn.oncomplete = () => db.close();
      });
    }
  
    async create(data) {
      const db = await this.connect();
      return new Promise((resolve, reject) => {
        const txn = db.transaction("visitas", "readwrite");
        const store = txn.objectStore("visitas");
        const query = store.add(data); // 👈 mejor add que put, para evitar sobrescribir sin querer
  
        query.onsuccess = () => resolve(query.result);
        query.onerror = (event) => reject(event.target.error);
  
        txn.oncomplete = () => db.close();
      });
    }
  
    async deleteById(id) {
      const db = await this.connect();
      return new Promise((resolve, reject) => {
        const txn = db.transaction("visitas", "readwrite");
        const store = txn.objectStore("visitas");
        const query = store.delete(id);
  
        query.onsuccess = () => resolve(`Registro ${id} eliminado`);
        query.onerror = (event) => reject(event.target.error);
  
        txn.oncomplete = () => db.close();
      });
    }
  
    async destroy() {
      const databases = await window.indexedDB.databases();
      for (const db of databases) {
        await new Promise((resolve) => {
          const deleteReq = window.indexedDB.deleteDatabase(db.name);
          deleteReq.onsuccess = resolve;
          deleteReq.onerror = resolve;
        });
      }
      console.log("Todas las bases de datos eliminadas");
    }
  }
  