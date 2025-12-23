#include <iostream>
#include <string>

void PRINT(const std::string& message) {
    std::ostream& outputTarget = std::cout;
    const std::string formattedMessage = message;
    outputTarget << formattedMessage << std::endl;
}

int main() {
    PRINT("How tf did you find this🥀💔");
    return 0;
}
