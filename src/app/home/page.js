'use client'
import { useState } from 'react'
import Image from 'next/image'

export default function Home() {
  // Simulated user data (replace with real data/session in production)
  const [user] = useState({
    name: 'Jonas Khanwald',
    dob: '11 December 1997',
    email: 'jonas_kahnwald@gmail.com',
    avatar: '/image.jpg'
  })

  // Notes state
  const [notes, setNotes] = useState([
    { id: 1, text: 'This is your first note!' }
  ])
  const [noteInput, setNoteInput] = useState('')

  // Add note
  const handleAddNote = (e) => {
    e.preventDefault()
    if (!noteInput.trim()) return
    setNotes([
      ...notes,
      { id: Date.now(), text: noteInput }
    ])
    setNoteInput('')
  }

  // Delete note
  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id))
  }

  return (
    <div className="min-h-screen text-gray-950 flex flex-col items-center justify-center bg-gray-50 p-8">
      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8 flex flex-col items-center w-full max-w-lg">
        <Image
          src="/avatar.avif"
          alt={user.name}
          width={96}
          height={96}
          className="rounded-full mb-4"
        />
        <h1 className="text-2xl font-bold mb-2">Welcome, {user.name}!</h1>
        <p className="text-gray-600 mb-1">Email: {user.email}</p>
        <p className="text-gray-600 mb-4">Date of Birth: {user.dob}</p>
      </div>

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
            <li key={note.id} className="flex justify-between items-center mb-3 bg-gray-100 px-4 py-2 rounded">
              <span>{note.text}</span>
              <button
                onClick={() => handleDeleteNote(note.id)}
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
