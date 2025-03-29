const username=process.env.username;
const password=process.env.password;

export const QuestionsDB ="mongodb+srv://"+username+":"+password+"@cluster0.enmfezu.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";
