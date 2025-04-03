import React, { useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useForm, Controller } from 'react-hook-form'

const base64ToBlob = (base64, mimeType = 'image/jpeg') => {
  const byteCharacters = atob(base64)
  const byteNumbers = new Array(byteCharacters.length)

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }

  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: mimeType })
}

const BlogForm = () => {
  const { register, handleSubmit, control, reset, setValue } = useForm()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)

    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('content', data.content)
    const imageTags = data.content.match(/<img[^>]*src="data:image\/[^>]*>/g) || []

    for (let i = 0; i < imageTags.length; i++) {
      const base64 = imageTags[i].match(/src="data:image\/[^;]+;base64,(.*?)"/)[1]
      const blob = base64ToBlob(base64)
      formData.append('images', blob, `image-${i}.jpg`)
    }

    setLoading(false)
  }

  const toolbarOptions = [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [
      { color: ['#0E0821', '#A120FE', '#F7F5FC'] },
      { background: ['#0E0821', '#A120FE', '#F7F5FC'] },
    ],
    [{ font: [] }],
    [{ align: [] }],
    ['link', 'image', 'video'], // Enable image and video upload
    ['clean'],
  ]
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block font-bold">Title</label>
          <input
            {...register('title', { required: 'Title is required' })}
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Blog Title"
          />
        </div>

        <div className="mb-4">
          <label className="block font-bold">Content</label>
          <div className="mb-4">
            <label className="block font-bold">Content</label>
            <Controller
              name="content"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <ReactQuill
                  {...field}
                  theme="snow"
                  onChange={field.onChange}
                  modules={{ toolbar: toolbarOptions }}
                />
              )}
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Blog'}
        </button>
      </form>
    </div>
  )
}

export default BlogForm
