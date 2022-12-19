export const createFormState = (fields, type = 'edit') => {
    const o = {
      id: -1,
      type: type, // edit, create
      saving: false,
      isChange: false,
      errors: {},
      fields: fields,
    }
    // Create errors
    for (const key in fields) {
      if (fields.hasOwnProperty(key)) {
        o.errors[key] = {
          status: '',
          type: '',
        }
      }
    }
    return o
  }
  
export const createTableState = () => {
    return {
      loading: false,
      data: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
    }
  }
  
export const normalizePagination = (meta) => {
    return {
      current: meta.current_page,
      pageSize: meta.per_page,
      total: meta.total,
    }
  }

export const  walkChilds = (data, { id, children }) => {
  
  return data.map(row => {
    if (row.id === id) {
      row.children = children
    } else if (row.children) {
      row.children = walkChilds(row.children, { id, children })
    }
    return row
  })
}
