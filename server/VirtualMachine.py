import subprocess

class VirtualMachine:

    def __init__(self, name, path, vmware_path, ip):

        self.name = name,
        self.path = path
        self.vmware_path = vmware_path
        self.run_command = f'"{self.vmware_path}vmrun" start "{self.path}" nogui'
        self.ip = ip
        print(self.run_command)

    def start(self):
        print("s")
        result = subprocess.run(self.run_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True)
        
        if result.returncode == 0:
            return result.stdout.strip()
        else:
            # Print error message if the command failed
            print(f"Error: {result.stderr.strip()}")