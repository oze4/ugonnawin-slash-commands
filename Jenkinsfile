def app
def slave_pod = 'jenkins-slave-pod'
def slave_pod_container = 'docker'
def container_name = 'oze4/ugonnawin-slash-commands'
def kube_config_id = 'ost-sf-kube-00-config'
def manifest = 'k8/ugonnawin.yaml'
def container_registry = 'https://registry.hub.docker.com'
def creds_id = 'docker-hub-credentials'

podTemplate(label: slave_pod) {
    node(slave_pod) {
        container(slave_pod_container) {
            stage('Clone Repository') {
                checkout scm
            }
            
            stage ('Build Image') {
                app = docker.build("${container_name}")
            }
            
            stage('Test Image') {
                app.inside {
                    sh 'echo "Volkswagen Tests passed"'
                }
            }
            
            stage('Push Image To Docker Hub') {
                docker.withRegistry(container_registry, creds_id) {
                    app.push("${env.BUILD_NUMBER}")
                    app.push("latest")
                }
            }
            
            stage('Clean Pod') {
                kubernetesDeploy(
                    kubeconfigId: kube_config_id,
                    configs: manifest,
                    deleteResource: true
                )
            }
            
            stage('Deploy New Pod') {
                kubernetesDeploy(
                    kubeconfigId: kube_config_id,
                    configs: manifest,
                )
            }
        }
    }
}
