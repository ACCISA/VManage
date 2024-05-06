import { createSlice } from '@reduxjs/toolkit'

export const machinesSlice = createSlice({
  name: 'machines',
  initialState: {
    isAuth: false,
    machines: [{
        machineName: "machine 1",
        vmxPath: "C:/Path/To/Machine/machine1.vmx",
        os: "Ubuntu",
        ip: "192.168.17.107"
      },
      {
        machineName: "machine 2",
        vmxPath: "C:/Path/To/Machine/machine2.vmx",
        os: "Ubuntu",
        ip: "192.168.17.102"
      },
      {
        machineName: "machine 3",
        vmxPath: "C:/Path/To/Machine/machine3.vmx",
        os: "Ubuntu",
        ip: "192.168.17.102"
      }]
  },
  reducers: {
    login: (state, machines) => {
        state.isAuth = true;
        state.machines = machines;
    },
    logout: (state) => {
        state.isAuth = false;
    },
    addMachine: (state, machine) => {
        state.machines.push(machine);
    },
    removeMachine: (state, action) => {
        const machineName = action.machineName;
        const machines = state.machines;
        for (let i = 0; i < machines.length; i++) {
            if (machines[i].machineName === machineName) {
                machines.pop(i)
            }
        }
    }
  }
})

// Action creators are generated for each case reducer function
export const { addMachine, removeMachine, login, logout } = machinesSlice.actions

export default machinesSlice.reducer