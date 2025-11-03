'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface CustomSession {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
    id?: string
  }
  expires: string
}

interface User {
  id: string
  email: string
  name: string | null
  role: string
  createdAt: string
}

export default function UsersPage() {
  const { data: session, status } = useSession() as { data: CustomSession | null; status: string }
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // State for user creation modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createUserForm, setCreateUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STAFF'
  })
  const [createUserLoading, setCreateUserLoading] = useState(false)
  const [createUserError, setCreateUserError] = useState('')

  // State for user edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editUserForm, setEditUserForm] = useState({
    id: '',
    name: '',
    email: '',
    role: 'STAFF'
  })
  const [editUserLoading, setEditUserLoading] = useState(false)
  const [editUserError, setEditUserError] = useState('')

  // State for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/login')
      return
    }

    // Check if user has admin role
    if (session.user?.role !== 'ADMIN') {
      router.push('/unauthorized')
      return
    }

    fetchUsers()
  }, [session, status, router])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users')
      
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      
      const data = await response.json()
      // The API returns users in a 'users' property, so we need to extract it
      setUsers(data.users || [])
    } catch (err) {
      setError('Failed to load users')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update user role')
      }
      
      // Refresh the user list
      fetchUsers()
    } catch (err) {
      setError('Failed to update user role')
      console.error(err)
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return

    try {
      const response = await fetch(`/api/users/${userToDelete.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete user')
      }
      
      // Refresh the user list
      fetchUsers()
      setIsDeleteDialogOpen(false)
      setUserToDelete(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user')
      console.error(err)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateUserLoading(true)
    setCreateUserError('')

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createUserForm),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create user')
      }

      // Refresh the user list
      await fetchUsers()
      
      // Reset form and close modal
      setCreateUserForm({
        name: '',
        email: '',
        password: '',
        role: 'STAFF'
      })
      setIsCreateModalOpen(false)
    } catch (err) {
      setCreateUserError(err instanceof Error ? err.message : 'Failed to create user')
      console.error(err)
    } finally {
      setCreateUserLoading(false)
    }
  }

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditUserLoading(true)
    setEditUserError('')

    try {
      // Update user role (name and email are not editable in this implementation)
      const response = await fetch(`/api/users/${editUserForm.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: editUserForm.role }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update user')
      }

      // Refresh the user list
      await fetchUsers()
      
      // Close modal
      setIsEditModalOpen(false)
    } catch (err) {
      setEditUserError(err instanceof Error ? err.message : 'Failed to update user')
      console.error(err)
    } finally {
      setEditUserLoading(false)
    }
  }

  const handleCreateUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCreateUserForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEditUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditUserForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCreateUserRoleChange = (value: string) => {
    setCreateUserForm(prev => ({
      ...prev,
      role: value
    }))
  }

  const handleEditUserRoleChange = (value: string) => {
    setEditUserForm(prev => ({
      ...prev,
      role: value
    }))
  }

  const openEditModal = (user: User) => {
    setEditUserForm({
      id: user.id,
      name: user.name || '',
      email: user.email,
      role: user.role
    })
    setIsEditModalOpen(true)
  }

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-gray-400 border-t-transparent" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </div>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new user account.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateUser}>
                  <div className="grid gap-4 py-4">
                    {createUserError && (
                      <Alert variant="destructive">
                        <AlertDescription>{createUserError}</AlertDescription>
                      </Alert>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <div className="col-span-3">
                        <Input
                          id="name"
                          name="name"
                          value={createUserForm.name}
                          onChange={handleCreateUserInputChange}
                          placeholder="John Doe"
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <div className="col-span-3">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={createUserForm.email}
                          onChange={handleCreateUserInputChange}
                          placeholder="user@example.com"
                          className="w-full"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="password" className="text-right">
                        Password
                      </Label>
                      <div className="col-span-3">
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={createUserForm.password}
                          onChange={handleCreateUserInputChange}
                          placeholder="Password"
                          className="w-full"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right">
                        Role
                      </Label>
                      <div className="col-span-3">
                        <Select value={createUserForm.role} onValueChange={handleCreateUserRoleChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="MANAGER">Manager</SelectItem>
                            <SelectItem value="STAFF">Staff</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createUserLoading}>
                      {createUserLoading ? (
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
                      ) : null}
                      Create User
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-gray-400 border-t-transparent" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'ADMIN' ? 'default' : user.role === 'MANAGER' ? 'secondary' : 'outline'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(user)}
                        >
                          Edit
                        </Button>
                        {user.role !== 'ADMIN' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRoleChange(user.id, 'ADMIN')}
                          >
                            Make Admin
                          </Button>
                        )}
                        {user.role !== 'MANAGER' && user.role !== 'ADMIN' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRoleChange(user.id, 'MANAGER')}
                          >
                            Make Manager
                          </Button>
                        )}
                        {user.role !== 'STAFF' && user.role !== 'ADMIN' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRoleChange(user.id, 'STAFF')}
                          >
                            Make Staff
                          </Button>
                        )}
                        {session.user.id !== user.id && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setUserToDelete(user)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user account information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditUser}>
            <div className="grid gap-4 py-4">
              {editUserError && (
                <Alert variant="destructive">
                  <AlertDescription>{editUserError}</AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <div className="col-span-3">
                  <Input
                    id="edit-name"
                    name="name"
                    value={editUserForm.name}
                    onChange={handleEditUserInputChange}
                    placeholder="John Doe"
                    className="w-full"
                    disabled
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <div className="col-span-3">
                  <Input
                    id="edit-email"
                    name="email"
                    value={editUserForm.email}
                    onChange={handleEditUserInputChange}
                    placeholder="user@example.com"
                    className="w-full"
                    disabled
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  Role
                </Label>
                <div className="col-span-3">
                  <Select value={editUserForm.role} onValueChange={handleEditUserRoleChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                      <SelectItem value="STAFF">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={editUserLoading}>
                {editUserLoading ? (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
                ) : null}
                Update User
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account for{' '}
              <strong>{userToDelete?.name || userToDelete?.email}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90">
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}