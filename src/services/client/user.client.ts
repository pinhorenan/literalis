import { httpClient } from '@lib/httpClient';
import type {
    UserDTO,
    PublicUserDTO,
    CreateUserDTO,
    UpdateUserDTO,
} from '@models/user.dto';

export const UserClient = {
    /** Busca perfil completo (UserDTO) */
    async getByUsername(username: string): Promise<UserDTO> {
        const res = await httpClient.get(`/api/users/${username}`);
        if (!res.ok) throw new Error('Erro ao buscar perfil.');
        return res.json();
    },

    /** Busca perfil público simples */
    async getPublicByUsername(username: string): Promise<PublicUserDTO> {
      const res = await httpClient.get(`/api/users/public/${username}`);
      if (!res.ok) throw new Error('Usuário não encontrado');
      return await res.json();
    },

    /** Busca usuários com texto (barra de pesquisa) */
    async search(query: string): Promise<PublicUserDTO[]> {
      const res = await httpClient.get(`/api/users/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Erro ao buscar usuários');
      return await res.json();
    },

    /** Lista todos os usuários públicos */
    async listAll(): Promise<PublicUserDTO[]> {
      const res = await httpClient.get(`/api/users`);
      if (!res.ok) throw new Error('Erro ao buscar usuários');
      return await res.json();
    },

    /** Atualiza dados do próprio perfil */
    async update(username: string, data: UpdateUserDTO) {
      const res = await httpClient.patch(`/api/users/${username}`, data);
      if (!res.ok) throw new Error('Erro ao atualizar perfil');
      return await res.json();
    },

    /** Remove a conta do próprio usuário */
    async delete(username: string) {
      const res = await httpClient.delete(`/api/users/${username}`);
      if (!res.ok) throw new Error('Erro ao excluir conta');
      return await res.json();
    },

    /** Cria um novo usuário (signup) */
    async create(data: CreateUserDTO) {
      const res = await httpClient.post(`/api/users`, data);
      if (!res.ok) throw new Error('Erro ao criar usuário');
      return await res.json();
    },
}