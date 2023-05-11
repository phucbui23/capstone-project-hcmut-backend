import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { doc, updateDoc } from 'firebase/firestore';
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

  async uploadProfile(file: Express.Multer.File, userAccountId: number) {
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

        try {
          deleteObject(desrtRef);
        } catch (error) {
          throw new BadRequestException({
            status: HttpStatus.BAD_REQUEST,
            error: error.message,
          });
        }

        // replace
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
        await this.prismaService.userAccount.update({
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

      // update on user firestore
      const user = await this.prismaService.userAccount.findUnique({
        where: {
          id: userAccountId,
        },
      });

      await updateDoc(
        doc(this.firebaseService.firestoreRef, 'users', user.code),
        {
          photoUrl: downloadUrl,
        },
      );

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

  async uploadImage(file: Express.Multer.File) {
    try {
      const fileRef = `chat_images/${file.originalname + ' ' + Date.now()}`;

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

  async uploadArticleAttachment(file: Express.Multer.File) {
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

      return await this.prismaService.attachment.create({
        data: {
          fileName: fileRef,
          fileSize: file.size,
          filePath: downloadUrl,
        },
      });
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
