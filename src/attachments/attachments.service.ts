import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { FirebaseService } from 'src/firebase/firebase.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';

@Injectable()
export class AttachmentsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async uploadImage(file: Express.Multer.File, userAccountId: number) {
    try {
      const fileRef = `images/${file.originalname + ' ' + Date.now()}`;

      const imagesRef = ref(this.firebaseService.storage, fileRef);
      const metadata = {
        contentType: file.mimetype,
      };

      const snapshot = await uploadBytesResumable(
        imagesRef,
        file.buffer,
        metadata,
      );
      const downloadUrl = await getDownloadURL(snapshot.ref);

      const currentProfilePicture =
        await this.prismaService.attachment.findUnique({
          where: { userAccountId },
        });

      if (currentProfilePicture) {
        // delete current profile pic on firebase
        const { fileName } = currentProfilePicture;
        const desrtRef = ref(this.firebaseService.storage, fileName);

        deleteObject(desrtRef).catch((error) => {
          throw new BadRequestException({
            status: HttpStatus.BAD_REQUEST,
            error: error.message,
          });
        });

        // replace
        const updatedProfilePicture =
          await this.prismaService.attachment.update({
            where: { userAccountId },
            data: {
              fileName: fileRef,
              fileSize: file.size,
              filePath: downloadUrl,
            },
            select: {
              fileName: true,
              filePath: true,
            },
          });
      } else {
        // Create a new profile pic for user
        const user = await this.prismaService.userAccount.update({
          where: {
            id: userAccountId,
          },
          data: {
            attachment: {
              create: {
                fileName: fileRef,
                fileSize: file.size,
                filePath: downloadUrl,
              },
            },
          },
        });
      }

      return {
        message: 'Image upload sucessfully!',
        name: file.originalname,
        type: file.mimetype,
        downloadUrl: downloadUrl,
      };
    } catch (error) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: error.message,
      });
    }
  }

  findAll() {
    return `This action returns all attachments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attachment`;
  }

  update(id: number, updateAttachmentDto: UpdateAttachmentDto) {
    return `This action updates a #${id} attachment`;
  }

  remove(id: number) {
    return `This action removes a #${id} attachment`;
  }
}
