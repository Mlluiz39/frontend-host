import { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Users from './Users'
import { toast } from 'react-toastify'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState(
    localStorage.getItem('email') || ''
  )
  const [password, setPassword] = useState('')
  const [domain, setDomain] = useState('')
  const [file, setFile] = useState(null)
  const [sites, setSites] = useState([])
  const [tab, setTab] = useState('painel')

  const token = localStorage.getItem('token')

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:4000/login', {
        email: userEmail,
        password,
      })

      if (response.status === 200 && response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('email', userEmail)
        setUserEmail(userEmail)
        setPassword('')
        setLoggedIn(true)
        fetchSites(response.data.token)
        toast.success('✅ Login realizado com sucesso!')
      } else {
        console.error('Login falhou ou token ausente')
        toast.error('❌ Credenciais inválidas')
      }
    } catch (err) {
      console.error('Erro no login:', err)
      toast.error('❌ Credenciais inválidas')
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    setLoggedIn(false)
    setUserEmail('')
  }

  const fetchSites = async (tk = token) => {
    try {
      const res = await axios.get('http://localhost:4000/sites', {
        headers: { Authorization: `Bearer ${tk}` },
      })
      setSites(res.data)
    } catch {
      alert('Erro ao carregar sites')
    }
  }

  const handleDeploy = async () => {
    const formData = new FormData()
    formData.append('dominio', domain)
    formData.append('zipfile', file)

    try {
      await axios.post('http://localhost:4000/deploy', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      alert('Deploy realizado com sucesso!')
      setDomain('')
      setFile(null)
      fetchSites()
    } catch (err) {
      alert('Erro no deploy')
      console.error(err)
    }
  }

  useEffect(() => {
    const t = localStorage.getItem('token')
    const e = localStorage.getItem('email')
    if (t && e) {
      setLoggedIn(true)
      setUserEmail(e)
      fetchSites(t)
    }
  }, [])

  if (!loggedIn) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <Card className="w-full max-w-sm shadow-md">
            <CardContent className="p-6 space-y-4">
              <h1 className="text-2xl font-bold text-center">
                Painel de Hospedagem
              </h1>
              <Input
                type="email"
                placeholder="Digite seu e-mail"
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Button className="w-full" onClick={handleLogin}>
                Entrar
              </Button>
            </CardContent>
          </Card>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-10">
        {/* Navbar fixa */}
        <div className="bg-white shadow sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex gap-4">
              <Button
                variant={tab === 'painel' ? 'default' : 'ghost'}
                onClick={() => setTab('painel')}
              >
                Painel
              </Button>
              <Button
                variant={tab === 'usuarios' ? 'default' : 'ghost'}
                onClick={() => setTab('usuarios')}
              >
                Usuários
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                Logado como: <strong>{userEmail}</strong>
              </span>
              <Button variant="warning" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Conteúdo da aba */}
        <div className="max-w-5xl mx-auto px-4 pt-6">
          {tab === 'painel' && (
            <>
              <Card className="shadow-sm mb-6">
                <CardContent className="p-6 space-y-4">
                  <Input
                    type="text"
                    placeholder="cliente.com"
                    value={domain}
                    onChange={e => setDomain(e.target.value)}
                  />
                  <Input
                    type="file"
                    onChange={e => setFile(e.target.files[0])}
                  />
                  <Button onClick={handleDeploy}>Fazer Deploy</Button>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {sites.map(site => (
                  <Card key={site.id}>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{site.dominio}</p>
                        <p className="text-sm text-muted-foreground">
                          Criado em:{' '}
                          {new Date(site.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <a
                        href={`http://${site.dominio}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button variant="outline">Ver Site</Button>
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {tab === 'usuarios' && <Users />}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default App
