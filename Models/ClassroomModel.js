class ClassroomModel {
    constructor (DAO) {
        this.DAO = DAO
    }
  
    createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS Classrooms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            classroomtext TEXT UNIQUE,
            studentPassword TEXT
        )`
        return this.DAO.run(sql)
    }

    add(classroom, password) {
        return this.DAO.run(
            'INSERT INTO Classrooms (classroomtext, studentPassword) VALUES (?, ?)',
            [classroom, password]
        );
    }

    getAll () {
        return this.DAO.all(
            'SELECT classroomtext, password FROM Classrooms'
        );
    }
}
  
module.exports = ClassroomModel;