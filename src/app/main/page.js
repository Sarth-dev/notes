'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://notesbackend-mne8.onrender.com/"

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [notes, setNotes] = useState([])
  const [noteInput, setNoteInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // On mount, check for JWT and fetch user info
  useEffect(() => {
    const jwt = typeof window !== "undefined" ? localStorage.getItem('jwt_token') : null
    if (!jwt) {
      router.push('/signin')
      return
    }
    // Optionally: verify token and fetch user/notes from backend
    fetch(`${API_BASE_URL}/me`, {
      headers: { "Authorization": `Bearer ${jwt}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setUser(data.user)
        return fetch(`${API_BASE_URL}/notes`, {
          headers: { "Authorization": `Bearer ${jwt}` }
        })
      })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setNotes(data))
      .catch(() => {
        localStorage.removeItem('jwt_token')
        router.push('/signin')
      })
      .finally(() => setLoading(false))
  }, [router])

  // Add note (requires JWT)
  const handleAddNote = async (e) => {
    e.preventDefault()
    if (!noteInput.trim()) return
    const jwt = localStorage.getItem('jwt_token')
    const res = await fetch(`${API_BASE_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`
      },
      body: JSON.stringify({ text: noteInput })
    })
    if (res.ok) {
      const note = await res.json()
      setNotes([...notes, note])
      setNoteInput('')
    } else {
      setError("Failed to add note.")
    }
  }

  // Delete note (requires JWT)
  const handleDeleteNote = async (id) => {
    const jwt = localStorage.getItem('jwt_token')
    const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${jwt}` }
    })
    if (res.ok) {
      setNotes(notes.filter(note => note._id !== id && note.id !== id))
    } else {
      setError("Failed to delete note.")
    }
  }

  if (loading) {
    return <div className="text-center text-lg mt-10">Loading...</div>
  }

  if (!user) return null // or fallback

  return (
    <div className="min-h-screen text-gray-950 flex flex-col items-center justify-center bg-gray-50 p-8">
      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8 flex flex-col items-center w-full max-w-lg">
        <Image
          src={user.avatar || "/avatar.avif"}
          alt={user.name}
          width={96}
          height={96}
          className="rounded-full mb-4"
        />
        <h1 className="text-2xl font-bold mb-2">Welcome, {user.name}!</h1>
        <p className="text-gray-600 mb-1">Email: {user.email}</p>
        <p className="text-gray-600 mb-4">Date of Birth: {user.dob}</p>
      </div>

      {/* Error */}
      {error && <div className="mb-4 text-red-600">{error}</div>}

      {/* Notes Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Your Notes</h2>
        <form onSubmit={handleAddNote} className="flex gap-2 mb-4">
          <input
            type="text"
            value={noteInput}
            onChange={e => setNoteInput(e.target.value)}
            placeholder="Enter a new note..."
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Create Note
          </button>
        </form>
        <ul>
          {notes.map(note => (
            <li key={note._id || note.id} className="flex justify-between items-center mb-3 bg-gray-100 px-4 py-2 rounded">
              <span>{note.text}</span>
              <button
                onClick={() => handleDeleteNote(note._id || note.id)}
                className="text-red-500 hover:underline px-2"
              >
                Delete
              </button>
            </li>
          ))}
          {notes.length === 0 && (
            <li className="text-gray-400">No notes yet.</li>
          )}
        </ul>
      </div>
    </div>
  )
}
