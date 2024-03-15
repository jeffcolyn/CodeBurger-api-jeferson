import * as Yup from 'yup';
import Category from '../models/Category';
import User from '../models/User';

class CategoryController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    try {
      await schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { admin: isAdmin } = await User.findByPk(request.userId);

    if (!isAdmin) {
      return response.status(401).json();
    }

    const { name } = request.body;

    let path;
    if (request.file) {
      path = request.file.filename;
    }

    const categoryExists = await Category.findOne({
      where: {
        name,
      },
    });

    if (categoryExists) {
      return response.status(400).json({ error: 'Category already exists' });
    }

    const category = await Category.create({ name, path });

    return response.status(201).json(category);
  }

  async index(request, response) {
    const categories = await Category.findAll();

    return response.json(categories);
  }

  async update(request, response) {
    
  }
}

export default new CategoryController();
