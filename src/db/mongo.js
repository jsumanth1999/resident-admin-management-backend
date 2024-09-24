import mongoose from 'mongoose';

   export const connecToMongoDB = async () => {
        try {
            const url = 'mongodb://127.0.0.1/Resident_Maintenance';
            await mongoose.connect(url);
    
            console.log('Connected to mongodb successfully');
        } catch (error) {
            console.log('error while connecting to mongodb', error);
        }
    };


