export type CreateServiceMaterialForm = {
  material_id: number | "";
  required_quantity: number;
};

export type ServiceMaterialRow = {
  id: number;
  material_id: number;
  required_quantity: number;
  material_title: string;
};
