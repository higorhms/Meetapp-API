import File from '../models/File';

class FileController {
    async index(req, res) {
        const { banner_id } = req.params;

        const response = await File.findByPk(banner_id);

        if (!response) {
            return res.status(401).json({ error: 'File not found' });
        }

        return res.json(response);
    }

    async store(req, res) {
        const { originalname: name, filename: path } = req.file;

        const { id, url } = await File.create({ name, path });

        return res.json({ id, name, path, url });
    }
}

export default new FileController();
