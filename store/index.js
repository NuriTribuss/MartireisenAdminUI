export const state = () => ({
    locales: ['tr', 'en'],
    locale: 'tr',
    access : true,
    quill : {
      settings: {
        
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['clean','link', 'image'],
          ],
          
          syntax: {
           highlight: text => hljs.highlightAuto(text).value
          }
        }
      },
      externalLink: window.location.protocol + '// ' + window.location.protocol + '/'
    },
    tinymce : {
      api_key : process.env.tinymce_api_key,
      settings : {
        height: 500,
        menubar: 'file edit view insert format tools table tc help',
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount'
        ],
        toolbar:
          'undo redo | formatselect  fontsizeselect  | bold italic forecolor  backcolor | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat | fullscreen  code help'
      }
    }
  })
  
export const mutations = {
    SET_LANG (state, locale) {
      if (state.locales.includes(locale)) {
        state.locale = locale
      }
    },
    SET_ACCESS(state,access){
      state.access = access;
    }
}