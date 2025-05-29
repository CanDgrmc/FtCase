import {
  CreateOptions,
  CreationAttributes,
  FindOptions,
  Model,
  ModelStatic,
  UpdateOptions,
  WhereOptions,
} from "sequelize";

type RepositoryModelType<T> = ModelStatic<T & Model>;
export default class RepositoryBase<T> {
  model: RepositoryModelType<T>;
  constructor(model: RepositoryModelType<T>) {
    this.model = model;
  }

  async findAll(opts?: FindOptions): Promise<T[]> {
    const data = await this.model.findAll(opts);
    return data;
  }

  async get(opts: FindOptions): Promise<T | null> {
    try {
      const data = await this.model.findOne(opts);

      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async create(
    payload: CreationAttributes<T & Model>,
    opts?: CreateOptions
  ): Promise<T> {
    const newData = await this.model.create(payload, opts);
    return newData;
  }

  async update(
    payload: Partial<CreationAttributes<T & Model>>,
    opts: UpdateOptions
  ): Promise<T> {
    try {
      await this.model.update(payload, opts);
      const m = await this.get({ where: opts?.where });

      if (!m) throw new Error("Record not found");

      return m;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getByPk(id: string | number, opts?: FindOptions): Promise<T | null> {
    try {
      const data = await this.model.findByPk(id, opts);
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async delete(id: string | number): Promise<boolean> {
    try {
      const where = { id } as unknown as WhereOptions<T>;

      const data = await this.model.destroy({ where });
      return !!data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
