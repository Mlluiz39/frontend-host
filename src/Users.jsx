import { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader } from 'lucide-react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Users() {
  const [usuarios, setUsuarios] = useState([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const token = localStorage.getItem('token')

  const fetchUsuarios = async () => {
    setLoading(true)
    try {
      const res = await axios.get('http://localhost:4000/usuarios', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsuarios(res.data)
    } catch (err) {
      if (token) {
        toast.error('Erro ao carregar usuários.')
      }
    } finally {
      setLoading(false)
    }
  }

  const criarUsuario = async () => {
    try {
      await axios.post(
        'http://localhost:4000/usuarios',
        { email, password },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setEmail('')
      setPassword('')
      fetchUsuarios()
    } catch (err) {
      if (token) {
        toast.error('❌ Erro ao criar usuário.')   
      }
    }
  }

  const deletarUsuario = async id => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return
    try {
      await axios.delete(`http://localhost:4000/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchUsuarios()
    } catch (err) {
      alert('Erro ao deletar usuário')
    }
  }

  useEffect(() => {
    if (token) {
      fetchUsuarios()
    }
  }, [token])

  // ✅ Spinner enquanto carrega
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 text-muted-foreground">
        <Loader className="h-6 w-6 animate-spin mb-2" />
        <span>Carregando usuários...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center">Gestão de Usuários</h2>

      <Card>
        <CardContent className="p-6 space-y-4">
          <Input
            type="email"
            placeholder="Novo e-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button
            disabled={!email || !password}
            onClick={criarUsuario}
            className="w-full"
          >
            Criar Usuário
          </Button>
        </CardContent>
      </Card>

      {usuarios.length > 0 ? (
        usuarios.map(user => (
          <Card key={user.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <p className="font-medium">{user.email}</p>
              <Button
                variant="destructive"
                onClick={() => deletarUsuario(user.id)}
              >
                Deletar
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-center text-muted-foreground">
          Nenhum usuário cadastrado ainda.
        </p>
      )}
    </div>
  )
}
