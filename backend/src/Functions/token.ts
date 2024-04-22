import jwt from 'jsonwebtoken';

export const getIdFromToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, process.env.SECRET as string);
        return decoded.id;
    } catch (error) {
        return null;
    }
}