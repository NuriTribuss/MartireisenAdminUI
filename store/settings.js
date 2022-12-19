
const STORED_SETTINGS = storedSettings => {
    const settings = {}
    Object.keys(storedSettings).forEach(key => {
      const item = JSON.parse(localStorage.getItem(`app.settings.${key}`))
      settings[key] = item !== null ? item : storedSettings[key]
    })
    return settings
  }
  
  export const state = () => ({
    ...STORED_SETTINGS({
      isSidebarOpen: false,
      isSupportChatOpen: false,
      isMobileView: false,
      isTabletView: false,
      isMobileMenuOpen: false,
      isMenuCollapsed: false,
      isMenuShadow: false,
      isMenuUnfixed: false,
      menuLayoutType: 'left', // left, top, nomenu
      menuType: 'default', // default, flyout, compact
      menuColor: 'dark', // dark, blue, gray, white
      flyoutMenuColor: 'dark', // dark, blue, gray, white
      systemLayoutColor: 'gray', // white, dark, blue, gray, image
      isTopbarFixed: false,
      isContentNoMaxWidth: false,
      isAppMaxWidth: false,
      isGrayBackground: false,
      isGrayTopbar: false,
      isCardShadow: false,
      isSquaredBorders: false,
      isBorderless: false,
      routerAnimation: 'slide-fadein-up', // none, slide-fadein-up, slide-fadein-right, fadein, zoom-fadein
    })
  })
  
  export const mutations = {
    CHANGE_SETTING(state, payload) {
      localStorage.setItem(`app.settings.${payload.setting}`, JSON.stringify(payload.value))
      state[payload.setting] = payload.value
    },
    SETUP_URL_SETTINGS(state, payload) {
      let queryParams = payload
      let keys = false
      if (payload.redirect) {
        const str = payload.redirect
        const subs = str.substring(str.indexOf('?') + 1)
        if (str.indexOf('?') >= 0) {
          queryParams = JSON.parse('{"' + decodeURI(subs).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
        }
      }
      delete queryParams['redirect']
      keys = Object.keys(queryParams)
      if (keys.length) {
        keys.forEach(key => {
          if (key in state) { state[key] = queryParams[key] === 'true' }
        })
      }
    },
  }