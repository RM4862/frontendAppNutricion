// src/routes/calendario/registro-consumo/+page.server.ts
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    // Aquí guardarías en DB; por ahora sólo simulamos “éxito”
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const payload = {
      date: form.get('date'),
      meal: form.get('meal'),
      desc: form.get('desc'),
      kcal: Number(form.get('kcal')),
      prot: Number(form.get('prot')),
      carb: Number(form.get('carb'))
    };
    return { message: 'Registro guardado correctamente.' };
  }
};
