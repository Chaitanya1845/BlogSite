const mongoose = require('mongoose');
const Blog = require('../models/blog');



mongoose.connect('mongodb://localhost:27017/blog-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const titles = [
    "5 Facts That Nobody Told You About Sports.",
    "7 Important Facts That You Should Know About Sports.",
    "Five Things Your Boss Needs To Know About Sports.",
    "How To Leave Sports Without Being Noticed.",
    "15 Mind Numbing Facts About Sports.",
    "10 Things To Avoid In Sports.",
    "7 Sports Tips You Need To Learn Now.",
];

const seedDB = async () => {
    await Blog.deleteMany();
    for (let i = 0; i < titles.length; i++) {
        const blog = new Blog({

            images: [
                {

                    url: 'https://res.cloudinary.com/dr3bbn6yy/image/upload/v1633445755/BlogApp/kmaeg7zaaztqfdhlge2j.jpg',
                    filename: 'BlogApp/kmaeg7zaaztqfdhlge2j'

                },
                {
                    url: 'https://res.cloudinary.com/dr3bbn6yy/image/upload/v1633418051/BlogApp/edkvuyhnt7uizqpmisit.jpg',
                    filename: 'BlogApp/edkvuyhnt7uizqpmisit'
                }
            ],
            author: '61607631550f23c355fa937d',
            title: titles[i],
            body: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source'

        })
        await blog.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})