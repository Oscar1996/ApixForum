import { Schema, model, Document } from 'mongoose';
import Post from './post.interface';

const postSchema = new Schema({
  author: String,
  content: String,
  title: String,
});

// TypeScript is now aware of all the fields you defined in the interface,
// and knows that it can expect them to be available in the post model.
const postModel = model<Post & Document>('Post', postSchema);

export default postModel;