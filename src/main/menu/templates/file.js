import { app } from 'electron'
import * as actions from '../actions/file'
import { userSetting } from '../actions/marktext'
import { isOsx } from '../../config'

export default function (keybindings, userPreference, recentlyUsedFiles) {
  const { autoSave } = userPreference.getAll()
  const fileMenu = {
    label: '&File',
    submenu: [{
      label: 'New Tab',
      accelerator: keybindings.getAccelerator('fileNewFile'),
      click (menuItem, browserWindow) {
        actions.newBlankTab(browserWindow)
      }
    }, {
      label: 'New Window',
      accelerator: keybindings.getAccelerator('fileNewTab'),
      click (menuItem, browserWindow) {
        actions.newEditorWindow()
      }
    }, {
      type: 'separator'
    }, {
      label: 'Open File',
      accelerator: keybindings.getAccelerator('fileOpenFile'),
      click (menuItem, browserWindow) {
        actions.openFile(browserWindow)
      }
    }, {
      label: 'Open Folder',
      accelerator: keybindings.getAccelerator('fileOpenFolder'),
      click (menuItem, browserWindow) {
        actions.openFolder(browserWindow)
      }
    }]
  }

  if (!isOsx) {
    const recentlyUsedMenu = {
      label: 'Open Recent',
      submenu: []
    }

    for (const item of recentlyUsedFiles) {
      recentlyUsedMenu.submenu.push({
        label: item,
        click (menuItem, browserWindow) {
          actions.openFileOrFolder(browserWindow, menuItem.label)
        }
      })
    }

    recentlyUsedMenu.submenu.push({
      type: 'separator',
      visible: recentlyUsedFiles.length > 0
    }, {
      label: 'Clear Recently Used',
      enabled: recentlyUsedFiles.length > 0,
      click (menuItem, browserWindow) {
        actions.clearRecentlyUsed()
      }
    })
    fileMenu.submenu.push(recentlyUsedMenu)
  } else {
    fileMenu.submenu.push({
      role: 'recentdocuments',
      submenu: [
        {
          role: 'clearrecentdocuments'
        }
      ]
    })
  }

  fileMenu.submenu.push({
    type: 'separator'
  }, {
    type: 'separator'
  }, {
    label: 'Save',
    accelerator: keybindings.getAccelerator('fileSave'),
    click (menuItem, browserWindow) {
      actions.save(browserWindow)
    }
  }, {
    label: 'Save As...',
    accelerator: keybindings.getAccelerator('fileSaveAs'),
    click (menuItem, browserWindow) {
      actions.saveAs(browserWindow)
    }
  }, {
    label: 'Auto Save',
    type: 'checkbox',
    checked: autoSave,
    id: 'autoSaveMenuItem',
    click (menuItem, browserWindow) {
      actions.autoSave(menuItem, browserWindow)
    }
  }, {
    type: 'separator'
  }, {
    label: 'Move To...',
    click (menuItem, browserWindow) {
      actions.moveTo(browserWindow)
    }
  }, {
    label: 'Rename...',
    click (menuItem, browserWindow) {
      actions.rename(browserWindow)
    }
  }, {
    type: 'separator'
  }, {
    label: 'Import...',
    click (menuItem, browserWindow) {
      actions.importFile(browserWindow)
    }
  }, {
    label: 'Export',
    submenu: [
      {
        label: 'HTML',
        click (menuItem, browserWindow) {
          actions.exportFile(browserWindow, 'styledHtml')
        }
      }, {
        label: 'PDF',
        click (menuItem, browserWindow) {
          actions.exportFile(browserWindow, 'pdf')
        }
      }
    ]
  }, {
    label: 'Print',
    accelerator: keybindings.getAccelerator('filePrint'),
    click (menuItem, browserWindow) {
      actions.print(browserWindow)
    }
  }, {
    type: 'separator',
    visible: !isOsx
  }, {
    label: 'Preferences',
    accelerator: keybindings.getAccelerator('filePreferences'),
    visible: !isOsx,
    click (menuItem, browserWindow) {
      userSetting(menuItem, browserWindow)
    }
  }, {
    type: 'separator'
  }, {
    label: 'Close Tab',
    accelerator: keybindings.getAccelerator('fileCloseTab'),
    click (menuItem, browserWindow) {
      actions.closeTab(browserWindow)
    }
  }, {
    label: 'Close Window',
    accelerator: keybindings.getAccelerator('fileCloseWindow'),
    role: 'close'
  }, {
    type: 'separator',
    visible: !isOsx
  }, {
    label: 'Quit',
    accelerator: keybindings.getAccelerator('fileQuit'),
    visible: !isOsx,
    click: app.quit
  })
  return fileMenu
}
