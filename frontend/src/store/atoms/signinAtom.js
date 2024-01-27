import { atom } from 'recoil'

export const signinAtom = atom({
    key: "signinAtom",
    default: {
        username: "",
        password: ""
    }
})